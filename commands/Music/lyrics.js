const { Default_Prefix, Color } = require("../../config.js");
const { Splitter } = require("../../Functions.js");
const Discord = require("discord.js");
const Finder = require("lyrics-finder");

module.exports = {
  name: "lyrics",
  aliases: ["ly"],
  category: "Music",
  description: "Show Song Lyrics!",
  usage: "Lyrics",
  run: async (client, message, args) => {
    
    const Queue = client.queue.get(message.guild.id);
    
    if (!Queue && !args[0]) return message.channel.send("Please Give Something To Search!");
    
    let Lyric, Thing = Queue ? Queue.Songs[0].Title : args.join(" ");
    
    try {
      Lyric = await Finder(Thing, '');
      if (!Lyric) {
        if (Queue && args[0]) {
          Lyric = await Finder(args.join(" "), '');
        } else {
          return message.channel.send("No Lyrics Found - " + Thing);
        };
      };
    } catch (error) {
      return message.channel.send("No Lyrics Found - " + Thing);
    };
    
    Lyric = await Lyric.replace(/(.{2021})/g,"\n1\n");
    
    const Embed = new Discord.MessageEmbed(), Embed2 = new Discord.MessageEmbed(), Embed3 = new Discord.MessageEmbed(), Embed4 = new Discord.MessageEmbed(), Embed5 = new Discord.MessageEmbed();
    Embed.setColor(Color), Embed.setTitle(Thing + " Lyrics!");
    Embed3.setColor(Color), Embed2.setColor(Color), Embed4.setColor(Color), Embed5.setColor(Color);
    
    if (Lyric.length <= 2021) {
      Embed.setDescription(Lyric);
      Embed.setTimestamp();
      return message.channel.send(Embed);
    };
    
    if (Lyric.length > 2021 && Lyric.length < 4042) {
      Embed.setDescription(Lyric.slice(0, 2021)), Embed2.setDescription(Lyric.slice(2021, -1)), Embed2.setTimestamp();
      await message.channel.send(Embed);
      return message.channel.send(Embed2);
    };
    
    if (Lyric.length > 4042 && Lyric.length < 6063) {
      Embed.setDescription(Lyric.slice(0, 2021)), Embed2.setDescription(Lyric.slice(2021, 4042)), Embed3.setDescription(4042, -1), Embed3.setTimestamp();
      await message.channel.send(Embed), await message.channel.send(Embed2);
      return message.channel.send(Embed3);
     };
    
    if (Lyric.length > 6063 && Lyric.length < 8084) {
      Embed.setDescription(Lyric.slice(0, 2021)), Embed2.setDescription(Lyric.slice(2021, 4042)), Embed3.setDescription(Lyric.slice(4042, 6063)), Embed4.setDescription(Lyric.slice(6063, -1)), Embed4.setTimestamp();
      await message.channel.send(Embed), await message.channel.send(Embed2), await message.channel.send(Embed3);
      return message.channel.send(Embed4);
    };
    
    if (Lyric.length > 8084 && Lyric.length < 10105) {
      Embed.setDescription(Lyric.slice(0, 2021)), Embed2.setDescription(Lyric.slice(2021, 4042)), Embed3.setDescription(Lyric.slice(4042, 6063)), Embed4.setDescription(Lyric.slice(6063, 8084)), Embed5.setDescription(Lyric.slice(8084, 10105)), Embed5.setTimestamp();
      await message.channel.send(Embed), await message.channel.send(Embed2), await message.channel.send(Embed3), await message.channel.send(Embed4);
      return message.channel.send(Embed5);
    };
    
    return message.channel.send(`${Thing} Lyrics Are Over 10105+ Characters!`);
  }
};