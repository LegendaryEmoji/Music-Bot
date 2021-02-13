module.exports.run = async (client, message, args) => {
    const Channel = message.member.voice.channel;
    if (!Channel) return message.channel.send("Error: No Voice Channel!");
    if (Channel.full) return message.channel.send("Error: Channel Is Full!");
    if (!Channel.joinable || !Channel.speakable) return message.channel.send("Error: Not Joinable Or Speakable!");
    if (message.guild.me.voice.channel) return message.channel.send(`Error: Already Connected To ${message.guild.me.voice.channel.id == Channel.id ? "Your" : "A"} Voice Channel!`);

    try {
        await Channel.join().then((Connection) => {
            Connection.voice.setSelfDeaf(true);
            message.react("✅");
        });
    } catch (e) {
        return message.channel.send("Error: Unknown").then(() => console.log(e));
    };
};

module.exports.help = {
    name: "join",
    aliases: ["joinvc", "jn"],
    cooldown: 7000,
    category: "Music",
    description: "Join Voice Channel!",
    usage: "Join",
    examples: ["join"]
};