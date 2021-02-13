module.exports.run = async (client, message, args, Discord) => {
    const Channel = message.member.voice.channel;
    if (!Channel) return message.channel.send("Error: No Voice Channel!");
    const Queue = client.queue.get(message.guild.id);
    if (!Queue) return message.channel.send("Error: No Queue, Please Add Some Songs By Using Play & Search Command!");

    const Current = await Queue.Songs.shift();
    Queue.Songs = Queue.Songs.sort(() => Math.random() - 0.5);
    await Queue.Songs.unshift(Current);

    try {
        await message.react("✅");
    } catch (e) {
        return message.channel.send("Error: Unknown").then(() => console.log(e));
    };
};

module.exports.help = {
    name: "shuffle",
    aliases: ["sfl"],
    cooldown: 7000,
    category: "Music",
    description: "Shuffle Music Queue!",
    usage: "Shuffle",
    examples: ["shuffle"]
};