/**
 * Copyright (c) Sflynlang
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import Bot from "@Bot";

import {
  GuildChannel,
  GuildMember,
  MessageEmbed,
  PartialGuildMember,
  TextChannel,
} from "discord.js";

async function onGuildMemberAdd(
  bot: Bot,
  member: GuildMember | PartialGuildMember
): Promise<void> {
  if (!member.user) {
    return;
  }

  // Get the rules channel id from the database.
  const rulesChannelS = await bot
    .getDatabase()
    .getSettingByKey("rules_channel");
  if (!rulesChannelS) {
    return;
  }

  // Get the guild rules channel by its id and check if it is a text channel.
  const rulesChannel = member.guild.channels.cache.get(rulesChannelS.value);
  if (
    !rulesChannel ||
    !((o: GuildChannel): o is TextChannel => o.type === "text")(rulesChannel)
  ) {
    return;
  }

  // Get the welcomes channel id from the database.
  const welcomesChannelS = await bot
    .getDatabase()
    .getSettingByKey("welcomes_channel");
  if (!welcomesChannelS) {
    return;
  }

  // Get the guild welcomes channel by its id and check if it is a text channel.
  const welcomesChannel = member.guild.channels.cache.get(
    welcomesChannelS.value
  );
  if (
    !welcomesChannel ||
    !((o: GuildChannel): o is TextChannel => o.type === "text")(welcomesChannel)
  ) {
    return;
  }

  // Colors list from MaterialUI.
  const colors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
    "#795548",
    "#5dc0b9",
  ];

  // Send an embed message to the welcomes channel.
  await welcomesChannel.send(
    new MessageEmbed()
      // Add the embed title with an icon.
      .setAuthor(
        `Welcome, ${member.user.username}`,
        member.user.displayAvatarURL()
      )
      // Get a random color.
      .setColor(colors[~~(Math.random() * colors.length - 1)])
      // Add the embed welcome message.
      .setDescription(
        `Hello ${member.user.toString()}, welcome to **Sflynlang** official Discord server. ` +
          `Remember read the ${rulesChannel.toString()} channel to keep the server in calm.`
      )
      // Add the current year and the Discord server name.
      .setFooter(
        `${new Date(Date.now()).getFullYear()} ~ ${member.guild.name}`,
        bot.getSflynIcon()
      )
  );
}

export default onGuildMemberAdd;
