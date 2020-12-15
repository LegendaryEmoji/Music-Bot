const { Default_Prefix, Color, Support } = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "ping",
  aliases: ["ms"],
  category: "Other",
  description: "Show Bot Ping!",
  usage: "Ping",
  run: async (client, message, args) => {
    return message.channel.send(`Pong - ${Math.round(client.ws.ping)}`);
  }
};