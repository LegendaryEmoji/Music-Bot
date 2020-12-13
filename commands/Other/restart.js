const {
  Default_Prefix,
  Token,
  Color,
  Support,
  Owner
} = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "restart",
  aliases: ["rs"],
  category: "Other",
  description: "Restart The Bot!",
  usage: "Restart",
  run: async (client, message, args) => {
    if (parseInt(Owner !== message.author.id))
      return message.channel.send(
        "You Don't Have Permission To Use This Command - Bot Owner"
      );
    
    await client.guilds.cache.forEach(g => {
      client.queue.get(g.id) ? client.queue.delete(g.id) : null
    });

    await client.destroy();

    await client
      .login(Token)
      .catch(() =>
        console.log(`Invalid Token Is Provided - Please Give Valid Token!`)
      );
    return message.channel.send(
      "Bot Has Been Restarted - Sorry If Bad Music Quality"
    );
  }
};
