/*
 * SonarQube
 * Copyright (C) 2009-2021 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
/* eslint-disable no-console */
process.env.NODE_ENV = 'development';

const fs = require('fs');
const chalk = require('chalk');
const esbuild = require('esbuild');
const http = require('http');
const httpProxy = require('http-proxy');
const getConfig = require('../config/esbuild-config');
const { getMessages } = require('./utils');

const port = process.env.PORT || 3000;
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || 'localhost';
const proxyTarget = process.env.PROXY || 'http://localhost:9000';

const config = getConfig(false);

function handleL10n(res) {
  getMessages()
    .then(messages => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ effectiveLocale: 'en', messages }));
    })
    .catch(e => {
      console.error(e);
      res.writeHead(500);
      res.end(e);
    });
}

function run() {
  console.log('starting...');
  esbuild
    .serve(
      {
        servedir: 'build/webapp'
      },
      config
    )
    .then(result => {
      const { port: esbuildport } = result;

      const proxy = httpProxy.createProxyServer();
      const esbuildProxy = httpProxy.createProxyServer({
        target: `http://localhost:${esbuildport}`
      });

      proxy.on('error', error => {
        console.error(chalk.blue('Backend'));
        console.error('\t', chalk.red(error.message));
        console.error('\t', error.stack);
      });

      esbuildProxy.on('error', error => {
        console.error(chalk.cyan('Frontend'));
        console.error('\t', chalk.red(error.message));
        console.error('\t', error.stack);
      });

      http
        .createServer((req, res) => {
          if (req.url.match(/js\/out/)) {
            esbuildProxy.web(req, res);
          } else if (req.url.match(/l10n\/index/)) {
            handleL10n(res);
          } else {
            proxy.web(
              req,
              res,
              {
                target: proxyTarget
              },
              e => console.error('req error', e)
            );
          }
        })
        .listen(port);

      console.log(`server started: http://localhost:${port}`);
    })
    .catch(e => console.error(e));
}

run();
