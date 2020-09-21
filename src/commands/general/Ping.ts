/**
 * Copyright (c) Sflynlang
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import command from '@Decorators/command';
import Command from '@Commands/Command';
import { Message } from 'discord.js';

@command({
  name: 'ping'
})
class PingCommand extends Command {
  async run(message: Message): Promise<void> {
    await message.reply('Pong!');
  }
}

export default PingCommand;
