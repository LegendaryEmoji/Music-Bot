module.exports.run = async (client, message, args, Discord) => {
    const Channel = message.member.voice.channel;
    if (!Channel) return message.channel.send("Error: No Voice Channel!");
    const Queue = client.queue.get(message.guild.id);
    if (!Queue || !Queue.Songs) return message.channel.send("Error: No Queue, Please Add Some Songs By Using Play & Search Command!");

    const Song = Queue.Songs[0],
        Type = ["YT", "SR"].includes(Song.Type) ? "Youtube" : Song.Type == "SC" ? "SoundCloud" : ["SP", "SPPL"].includes(Song.Type) ? "Spotify" : "Facebook";

    const Embed = new Discord.MessageEmbed()
        .setColor(client.Color)
        .setAuthor("Now Playing", message.author.avatarURL({
            dynamic: true
        }))
        .setThumbnail(Song.Thumbnail)
        .setDescription(`Source - ${Type}\nTitle - [${Song.Title}](${Song.Link})\nDuration - ${Song.Duration}\nAdded By - ${Song.Req}`)
        .setFooter(`Requested By ${message.author.username}`)
        .setTimestamp();

    return message.channel.send(Embed);
};

module.exports.help = {
    name: "nowplaying",
    aliases: ["np"],
    cooldown: 7000,
    category: "Music",
    description: "Get Currently Playing Song Information!",
    usage: "Nowplaying",
    examples: ["nowplaying"]
};