module.exports.run = async (client, message, args) => {
    const Channel = message.member.voice.channel;
    if (!Channel) return message.channel.send("Error: No Voice Channel!");
    const Queue = client.queue.get(message.guild.id);
    if (!Queue || !Queue.Songs) return message.channel.send("Error: No Queue, Please Add Some Songs By Using Play & Search Command!");

    const Songs = await Queue.Songs.map((S, I) => {
        const Position = (I + 1) == 1 ? "Now Playing" : (I - 1) == 0 ? 1 : I + 1;
        return `${Position} | ${S.Title.length > 50 ? `${S.Title.slice(0, 50)}...` : S.Title}${Position == "Now Playing" ? "\n" : ""}`;
    }).join("\n");

    if (!Songs) return message.channel.send("Error: No Queue, Please Add Some Songs By Using Play & Search Command!");

    return message.channel.send(Songs, {
        split: {
            char: "\n"
        }
    });
};

module.exports.help = {
    name: "queue",
    aliases: ["q", "qu"],
    cooldown: 7000,
    category: "Music",
    description: "Get Music Queue!",
    usage: "Queue",
    examples: ["queue"]
};