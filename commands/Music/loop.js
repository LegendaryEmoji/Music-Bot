const { Default_Prefix, Color } = require("../../config.js");
const Discord = require("discord.js");

module.exports = {
  name: "loop",
  aliases: ["lp"],
  category: "Music",
  description: "Show Loop Status & You Can Also Set Loop Status!",
  usage: "Loop | <On Or Off>",
  run: async (client, message, args) => {
    
    const Channel = message.member.voice.channel;
    
    if (!Channel) return message.channel.send("Please Join A Voice Channel!");
    
    const Queue = await client.queue.get(message.guild.id);
    
    if (!Queue) return message.channel.send("Nothing Is Playing Right Now, Add Some Songs To Queue :D");
    
    const Embed = new Discord.MessageEmbed()
    .setColor(Color)
    .setTitle("Success")
    .setDescription(`🎶 Loop Has Been ${Queue.Loop ? "Enabled" : "Disabled"}!`)
    .setTimestamp();
    
    Queue.Loop = Queue.Loop ? false : true;
    
    return message.channel.send(Embed).catch(() => message.channel.send(`🎶 Loop Has Been ${Queue.Loop ? "Enabled" : "Disabled"}!`));
    
  }
};