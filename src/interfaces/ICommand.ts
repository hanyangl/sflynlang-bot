/**
 * Copyright (c) Sflynlang
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import { Client, Message } from 'discord.js';

export interface ICommandMethods {
  /**
   * Command name.
   * 
   * @readonly
   * @property
   */
  readonly name: string;
}

export interface ICommandExecution {
  /**
   * Execute the command.
   * 
   * @async
   * @function
   * @param { Message } message
   * @param { string[] } args
   * @returns { Promise<void> }
   */
  run(message: Message, args: string[]): Promise<void>;
}

export default interface ICommand extends ICommandMethods, ICommandExecution {
  /**
   * Bot client.
   * 
   * @property
   * @readonly
   */
  readonly bot: Client;
}
