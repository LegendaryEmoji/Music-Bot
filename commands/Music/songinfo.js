const { Default_Prefix, Color } = require("../../config.js"),
  { Objector, GetRegxp, Linker } = require("../../Functions.js");
const Discord = require("discord.js"),
  Sr = require("youtube-sr").default,
  Ytdl = require("discord-ytdl-core");

module.exports = {
  name: "songinfo",
  aliases: ["songinformation", "si"],
  category: "Music",
  description: "Show Youtube Song Information!",
  usage: "Songinformation <Song Youtube ID | Song Youtube Link | Song Name>",
  run: async (client, message, args) => {
    const Value = args.join(" "),
      Queue = client.queue.get(message.guild.id);
    let Song, SongInfo, Type, Link;

    const YtID = await GetRegxp("YtID"),
      YtUrl = await GetRegxp("YtUrl");

    if (!Value)
      return message.channel.send(
        "Please Give Song Youtube ID Or Song Youtube Link Or Song Name!"
      );

    try {
      if (YtID.test(Value)) {
        Link = await Linker(Value);
        console.log(Link);
      } else if (YtUrl.test(Value)) {
        Link = Value;
      } else {
        await Sr.searchOne(Value).then(async Info => {
          Link = `https://www.youtube.com/watch?v=${Info.id}`;
        });
      }
    } catch (error) {
      console.log(error);
      return message.channel.send("Error: No Video Found!");
    };

    try {
      const YtInfo = await Ytdl.getInfo(Link);
      SongInfo = YtInfo.videoDetails;
      Song = await Objector(SongInfo, message);
    } catch (error) {
      console.log(error);
      return message.channel.send("Error: No Video Found!");
    };

    const Data = `Song - **[${Song.Title}](${Song.Link})**\nCreator - **[${
      Song.Author
    }](${Song.AuthorLink})**\nUpload - **${
      Song.Upload
    }**\nViews - **${Song.Views || 0}**\nDuration - **${Song.Duration ||
      "∞"}**`;

    const Embed = new Discord.MessageEmbed()
      .setColor(Color)
      .setThumbnail(Song.Thumbnail)
      .setTitle(Song.Title + " Information!")
      .setDescription(Data)
      .setFooter(`Requested By ${message.author.username}`)
      .setTimestamp();

    return message.channel.send(Embed);
  }
};
