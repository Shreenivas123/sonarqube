/*
 * Sonar, open source software quality management tool.
 * Copyright (C) 2008-2012 SonarSource
 * mailto:contact AT sonarsource DOT com
 *
 * Sonar is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * Sonar is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with Sonar; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */
package org.sonar.api.batch;

/**
 * Provide description of a task.
 * @since 3.5
 */
public class TaskDescriptor {

  private String name;
  private String decription;
  private String command;
  private boolean requiresProject = false;

  private TaskDescriptor() {

  }

  public static TaskDescriptor create() {
    return new TaskDescriptor();
  }

  public String getName() {
    return name;
  }

  public TaskDescriptor setName(String name) {
    this.name = name;
    return this;
  }

  public String getDecription() {
    return decription;
  }

  public TaskDescriptor setDescription(String decription) {
    this.decription = decription;
    return this;
  }

  public String getCommand() {
    return command;
  }

  public TaskDescriptor setCommand(String command) {
    this.command = command;
    return this;
  }

  public boolean isRequiresProject() {
    return requiresProject;
  }

  public TaskDescriptor setRequiresProject(boolean requiresProject) {
    this.requiresProject = requiresProject;
    return this;
  }

}
