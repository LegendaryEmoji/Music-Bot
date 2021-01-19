const { Default_Prefix, Color, Support } = require("../../config.js"), { Player } = require("../../Functions.js");
const Discord = require("discord.js"), db = require("wio.db"), Ytdl = require("discord-ytdl-core");

module.exports = {
  name: "clean",
  aliases: ["cc"],
  category: "Music",
  description: "Make Bot Music Better!",
  usage: "Clean",
  run: async (client, message, args) => {
    const Channel = message.member.voice.channel;

    if (!Channel) return message.channel.send("Please Join A Voice Channel!");

    let Queue = await client.queue.get(message.guild.id), All = Queue, Joined;

    if (!Queue)
      return message.channel.send(
        "Nothing Is Playing Right Now, Add Some Songs To Queue :D"
      );
    
    await message.guild.me.voice.kick(), await client.queue.delete(message.guild.id);
    
    setTimeout(async () => {
      try {
        Joined = await Channel.join();
        All["Bot"] = Joined;
      } catch (error) {
        console.log(error);
        return message.channel.send("Error: I Can't Join The Voice Channel!");
      };
      await client.queue.set(message.guild.id, All);
      await Player(message, Discord, client, Ytdl, { Play: All.Songs[0], Color: Color }, db);
      const Embed = new Discord.MessageEmbed()
      .setColor(Color)
      .setTitle("Success")
      .setDescription("🎶 Music Has Been Cleaned!")
      .setTimestamp();
      return message.channel.send(Embed).catch(() => message.channel.send("🎶 Music Has Been Cleaned!"));
    }, 1500);
  }
};
