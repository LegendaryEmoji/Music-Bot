const { Default_Prefix, Color } = require("../../config.js");
const Discord = require("discord.js");

module.exports = {
  name: "join",
  aliases: ["come"],
  category: "Music",
  description: "Join The Voice Channel!",
  usage: "Join",
  run: async (client, message, args) => {
    
    const Channel = message.member.voice.channel;
    
    if (!Channel) return message.channel.send("Please Join A Voice Channel!");
    
    if (!Channel.joinable) return message.channel.send("I Can't Join The Voice Channel!");
    
    const Joined = await Channel.join().catch(() => {
      return message.channel.send("Unable To Join The Voice Channel!");
    });
    
    await Joined.voice.setSelfDeaf(true, "Privacy");
    
    const Embed = new Discord.MessageEmbed()
    .setColor(Color)
    .setTitle("Success")
    .setDescription("🎶 Joined The Voice Channel, Use Play Command To Play Music!")
    .setTimestamp();
    
    return message.channel.send(Embed).catch(() => message.channel.send("🎶 Joined The Voice Channel, Use Play Command To Play Music!"));
  }
};