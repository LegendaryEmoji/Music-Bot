module.exports.run = async (client, message, args) => {
    const Channel = message.member.voice.channel,
        Bot = message.guild.me.voice.channel;
    if (!Channel) return message.channel.send("Error: No Voice Channel!");
    const Queue = client.queue.get(message.guild.id);
    if (!Queue) return message.channel.send("Error: No Queue, Please Add Some Songs By Using Play & Search Command!");
    if (!message.member.hasPermission("MANAGE_MESSAGES") && Bot.members.length > 2) return message.channel.send("Error: Request Cancelled Due To 2+ Members");

    Queue.Songs = [];
    await Queue.Connection.dispatcher.end();

    try {
        await message.react("✅");
    } catch (e) {
        return message.channel.send("Error: Unknown").then(() => console.log(e));
    };
};

module.exports.help = {
    name: "clearqueue",
    aliases: ["deletequeue", "cq", "dq"],
    cooldown: 7000,
    category: "Music",
    description: "Clear Music Queue!",
    usage: "Clearqueue",
    examples: ["clearqueue"]
};