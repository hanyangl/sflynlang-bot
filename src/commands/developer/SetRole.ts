/**
 * Copyright (c) Sflynlang
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import { developer } from "@Decorators/commandTypes";
import command from "@Decorators/command";
import Command from "@Commands/Command";
import IMessage from "@Interfaces/IMessage";

@developer
@command({
  name: "setrole",
  arguments: "<role_type> <role_mention>",
  description: "Set a role to the settings.",
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

    // Get the next argument as the role type.
    const roleType = args.shift();

    // Check if the argument exists.
    if (!roleType) {
      await message.sendAndDestroyInFiveSeconds(
        "you must specify the role type."
      );
      return;
    }

    // Get the developer role id from the database.
    const devRole = await message.getDevRole();

    if (roleType === "dev") {
      // Check if the user has the `administrator` permission.
      if (!message.member.hasPermission("ADMINISTRATOR")) {
        await message.sendAndDestroyInFiveSeconds(
          "you need be a server administrator."
        );
        return;
      }
    } else {
      if (!["mod"].includes(roleType)) {
        await message.sendAndDestroyInFiveSeconds(
          `the role type ('${roleType}') is not valid.`
        );
        return;
      }

      // Check if the developer role exists.
      if (!devRole) {
        await message.sendAndDestroyInFiveSeconds(
          "the developer role is not configured."
        );
        return;
      }

      // Check if the command actioner has the developer role.
      if (!message.member.roles.cache.has(devRole.value)) {
        await message.sendAndDestroyInFiveSeconds(
          "you need be a server bot developer."
        );
        return;
      }
    }

    // Get the next argument as the role mention.
    const roleMention = args.shift();

    // Check if the argument exists.
    if (!roleMention) {
      await message.sendAndDestroyInFiveSeconds(
        `you must mention the new ${roleType} role.`
      );
      return;
    }

    // Get the first role mention.
    const firstRole = message.mentions.roles.first();

    // Check if the argument and the first role mention are equals.
    if (!firstRole || firstRole.toString() !== roleMention) {
      await message.sendAndDestroyInFiveSeconds("the role is not valid.");
      return;
    }

    // Get the role key.
    const key = `${roleType.toLowerCase()}_role`;

    // Get the role type from the database.
    const editRole = await message.bot.getDatabase().getSettingByKey(key);

    // Check if the role exists in the database and updates it.
    if (editRole) {
      editRole.value = firstRole.id;
      await editRole.save();
    }
    // Otherwise, create a new role setting.
    else {
      await message.bot.getDatabase().getSettings().create({
        key,
        value: firstRole.id,
      });
    }

    // Send the success message to the current channel.
    await message.sendAndDestroyInFiveSeconds(
      `now ${firstRole.toString()} is the ${roleType} role.`
    );
  }
}

export default SetRole;
