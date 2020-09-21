/**
 * Copyright (c) Sflynlang
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import ICommand from '@Interfaces/ICommand';
import { Client } from 'discord.js';
import PingCommand from './general/Ping';

/**
 * Commands Manager.
 * @class
 */
class CommandsManager {
  private commands: ICommand[];

  constructor() {
    this.commands = [];
  }

  /**
   * Start the commands manager.
   * 
   * @function
   * @param { Client } bot
   * @returns { void }
   */
  run(bot: Client): void {
    this.commands.push(new PingCommand(bot));
  }

  /**
   * Get a command by its name.
   * 
   * @function
   * @param { string } name
   * @returns { ICommand | null }
   */
  getCommandByName(name: string): ICommand | null {
    return this.commands.find((command) => command.name === name) || null;
  }
}

export default CommandsManager;
