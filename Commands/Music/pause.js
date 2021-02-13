module.exports.run = async (client, message, args, Discord) => {
    const Channel = message.member.voice.channel;
    if (!Channel) return message.channel.send("Error: No Voice Channel!");
    const Queue = client.queue.get(message.guild.id);
    if (!Queue) return message.channel.send("Error: No Queue, Please Add Some Songs By Using Play & Search Command!");
    if (!Queue.Playing) return message.channel.send("Error: Already Paused!");

    Queue.Playing = false;
    Queue.Connection.dispatcher.pause();

    try {
        await message.react("✅");
    } catch (e) {
        return message.channel.send("Error: Unknown").then(() => console.log(e));
    };
};

module.exports.help = {
    name: "pause",
    aliases: ["p", "ps", "stop", "sop"],
    cooldown: 7000,
    category: "Music",
    description: "Pause Currently Playing Song!",
    usage: "Pause",
    examples: ["pause"]
};