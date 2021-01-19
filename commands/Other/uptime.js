const { Default_Prefix, Color, Support } = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "uptime",
  aliases: ["ut"],
  category: "Other",
  description: "Show Bot Uptime!",
  usage: "Uptime",
  run: async (client, message, args) => {
    const Seconds = Math.floor(client.uptime / 1000);
    const Minutes = Math.floor(Seconds / 60);
    const Hours = Math.floor(Minutes / 60);
    const Days = Math.floor(Hours / 24);    
    const RemoveUseless = (Duration) => {
      return Duration.replace("0 Day\n", "").replace("0 Hour\n", "").replace("0 Minute\n", "");
    };
    let Total = await RemoveUseless(`${Days} ${Days > 1 ? "Days" : "Day"}\n${Hours} ${Hours > 1 ? "Hours" : "Hour"}\n${Minutes} ${Minutes > 1 ? "Minutes" : "Minute"}\n${Seconds} ${Seconds > 1 ? "Seconds" : "Second"}`);
    
    const Embed = new Discord.MessageEmbed()
    .setColor(Color)
    .setTitle("Success")
    .setDescription(Total)
    .setTimestamp();
    
    return message.channel.send(Embed).catch(() => message.channel.send(Total));
  }
};
