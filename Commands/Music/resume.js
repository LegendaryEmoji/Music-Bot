module.exports.run = async (client, message, args, Discord) => {
    const Channel = message.member.voice.channel;
    if (!Channel) return message.channel.send("Error: No Voice Channel!");
    const Queue = client.queue.get(message.guild.id);
    if (!Queue) return message.channel.send("Error: No Queue, Please Add Some Songs By Using Play & Search Command!");
    if (Queue.Playing) return message.channel.send("Error: Not Paused!");

    Queue.Playing = true;
    Queue.Connection.dispatcher.resume();

    try {
        await message.react("✅");
    } catch (e) {
        return message.channel.send("Error: Unknown").then(() => console.log(e));
    };
};

module.exports.help = {
    name: "resume",
    aliases: ["r", "rs"],
    cooldown: 7000,
    category: "Music",
    description: "Resume Currently Paused Song!",
    usage: "Resume",
    examples: ["resume"]
};