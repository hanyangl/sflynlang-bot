/**
 * Copyright (c) Sflynlang
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import ICommand from '@Interfaces/ICommand';
import { Client, Message } from 'discord.js';

/**
 * Empty command.
 * @class
 */
class Command implements ICommand {
  readonly name: string = '';
  readonly bot: Client;

  constructor(bot: Client) {
    this.bot = bot;
  }

  async run(_message: Message, _args: string[]): Promise<void> {};
}

export default Command;
