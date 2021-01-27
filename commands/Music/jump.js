const { Default_Prefix, Color } = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "jump",
  aliases: ["skipto"],
  category: "Music",
  description: "Jump To A Song In The Queue!",
  usage: "jump <Queue_Number>",
  run: async (client, message, args) => {
    
    const Channel = message.member.voice.channel;
    
    if (!Channel) return message.channel.send("Please Join A Voice Channel!");
    
    const Queue = await client.queue.get(message.guild.id);
    
    if (!Queue) return message.channel.send("Nothing Is Playing Right Now, Add Some Songs To Queue :D");
    
    if (!Queue.Playing) Queue.Playing = true;

    if (!args[0] || isNaN(args[0]) || Number(args[0]) >= Queue.Songs.length || Number(args[0]) < 1) return message.channel.send(`Please use queue number between 1 and ${Queue.Songs.length - 1}`);

    if (Queue.Loop) {
      for (let i = 0; i < args[0] - 1; i++) {
        Queue.Songs.push(Queue.Songs.shift());
      }
    } else {
      Queue.Songs = Queue.Songs.slice(args[0] - 1);
    }

    await Queue.Bot.dispatcher.end();
    
    const Embed = new Discord.MessageEmbed()
    .setColor(Color)
    .setTitle("Success")
    .setDescription(`🎶 **${args[0]}** Music Has Been Skipped!`)
    .setTimestamp();
    
    return message.channel.send(Embed).catch(() => message.channel.send("🎶 Music Has Been Skipped!"));
  }
};
