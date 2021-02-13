const {
    GetInfo,
    Player
} = require("../../Player.js"), Sr = require("youtube-sr").default;

module.exports.run = async (client, message, args, Discord) => {
    let Value = args.join(" "),
        Channel = message.member.voice.channel,
        Queue = await client.queue.get(message.guild.id);
    if (!Channel) return message.channel.send("Error: No Voice Channel!");
    if (!Channel.joinable || !Channel.speakable) return message.channel.send("Error: Voice Channel Not Joinable Or Speakable!");
    if (!Value) return client.commands.get("help").run(client, message, ["play", client.token], Discord);

    let Music = await GetInfo(Value, message),
        Song, Songs, Connection, T = {};

    if (!Music) return message.channel.send("Error: No Song Found!");
    if (Music.P) {
        Songs = Music.Videos;
        Song = Music.Videos[0];
        T = Music;
    } else {
        Song = Music;
    };
    if (Queue) {
        await (T.P ? Queue.Songs.push(...Songs) : Queue.Songs.push(Song));
        const QueueAdd = new Discord.MessageEmbed()
            .setColor(client.Color)
            .setThumbnail(Songs ? T.Other.thumbnail ? T.Other.thumbnail : T.Thumbnail : Song.Thumbnail)
            .setAuthor((Songs ? "Playlist" : "Song") + " Added", message.author.avatarURL({
                dynamic: true
            }))
            .setDescription((Songs ? `[${T.Name}](${T.Link})` : `[${Song.Title}](${Song.Link})`) + " Has Been Added To Queue!")
            .setTimestamp();
        return message.channel.send(QueueAdd);
    };

    try {
        Connection = await Channel.join();
        await Connection.voice.setSelfDeaf(true);
    } catch (e) {
        console.log(e);
        return message.channel.send("Error: Unable To Join Voice Channel!");
    };

    await client.queue.set(message.guild.id, {
        Text: message.channel,
        Voice: Channel,
        Connection,
        Volume: 100,
        Filters: {},
        Songs: Songs ? [...Songs] : [Song],
        Steam: null,
        Loop: false,
        Day: false,
        Playing: true
    });

    Queue = await client.queue.get(message.guild.id);

    try {
        await Player(client, message, {
            Song: Song
        });
    } catch (e) {
        await Channel.leave(), await client.queue.delete(message.guild.id), await console.log(e);
        return message.channel.send("Error: Something Went Wrong, Try Again Later!");
    };
};

module.exports.help = {
    name: "play",
    aliases: ["p", "pl"],
    cooldown: 5000,
    category: "Music",
    description: "Play Music From Youtube (Video ID, Video Link, Playlist ID, Playlist Link), Soundcloud (Song Link, Playlist Link), Spotify (Song Link, Playlist Link), Facebook (Song Link)!",
    usage: "Play <Song | Playlist>",
    examples: ["play attention", "play nfs8NYg7yQM", "play https://www.youtube.com/watch?v=nfs8NYg7yQM", "play ncs playlist", "play PLzkuLC6Yvumv_Rd5apfPRWEcjf9b1JRnq", "play https://www.youtube.com/playlist?list=PLzkuLC6Yvumv_Rd5apfPRWEcjf9b1JRnq", "play https://www.youtube.com/watch?v=bM7SZ5SBzyY&list=PLzkuLC6Yvumv_Rd5apfPRWEcjf9b1JRnq"]
};