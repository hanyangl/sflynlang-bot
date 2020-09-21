/**
 * Copyright (c) Sflynlang
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import { developer } from '@Decorators/commandTypes';
import command from '@Decorators/command';
import Command from '@Commands/Command';
import IMessage from '@Interfaces/IMessage';

@developer
@command({
  name: 'setrole',
  arguments: '<dev/mod> <role_mention>',
  description: 'Set a role to the settings.',
})
class SetRole extends Command {
  async run(message: IMessage, args: string[]): Promise<void> {
    // Ignore private messages.
    if (!message.guild || !message.member) {
      return;
    }

    // Check if the message can be deleted.
    if (message.deletable) {
      // Delete the message.
      await message.delete();
    }

    const roleType = args.shift();

    if (!roleType) {
      await message.sendAndDestroyInFiveSeconds('you must specify the role type.');
      return;
    }

    const devRole = await message.getDevRole();

    if (roleType === 'dev') {
      // Check if the user has the `administrator` permission.
      if (!message.member.hasPermission('ADMINISTRATOR')) {
        await message.sendAndDestroyInFiveSeconds('you need be a server administrator.');
        return;
      }
    } else {
      if (!['mod'].includes(roleType)) {
        await message.sendAndDestroyInFiveSeconds(`the role type ('${roleType}') is not valid.`);
        return;
      }

      if (!devRole) {
        await message.sendAndDestroyInFiveSeconds('the developer role is not configured.');
        return;
      }

      if (!message.member.roles.cache.has(devRole.value)) {
        await message.sendAndDestroyInFiveSeconds('you need be a server bot developer.');
        return;
      }
    }

    const roleMention = args.shift();

    if (!roleMention) {
      await message.sendAndDestroyInFiveSeconds(`you must mention the new ${roleType} role.`);
      return;
    }

    // Get the first role mention.
    const firstRole = message.mentions.roles.first();

    if (!firstRole || firstRole.toString() !== roleMention) {
      await message.sendAndDestroyInFiveSeconds('the role is not valid.');
      return;
    }

    const key = `${roleType.toLowerCase()}_role`;
    const editRole = await message.bot.getDatabase().getSettingByKey(key);

    if (editRole) {
      editRole.value = firstRole.id;
      await editRole.save();
    } else {
      await message.bot.getDatabase().getSettings().create({
        key,
        value: firstRole.id,
      });
    }

    // Send the success message to the current channel.
    await message.sendAndDestroyInFiveSeconds(`now ${firstRole.toString()} is the ${roleType} role.`);
  }
}

export default SetRole;
