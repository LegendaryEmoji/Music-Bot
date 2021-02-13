module.exports.run = async (client, message, args) => {
    const Channel = message.member.voice.channel,
        Bot = message.guild.me.voice.channel;
    if (!Channel) return message.channel.send("Error: No Voice Channel!");
    if (!Bot) return message.channel.send("Error: No Bot Voice Channel!");
    if (Bot.id != Channel.id) return message.channel.send("Error: Different Voice Channels!");
    if (!message.member.hasPermission("MANAGE_CHANNELS") && Bot.members.length > 2) return message.channel.send("Error: Request Cancelled Due To 2+ Members");

    try {
        await Bot.leave();
        await message.react("✅");
    } catch (e) {
        return message.channel.send("Error: Unknown").then(() => console.log(e));
    };
};

module.exports.help = {
    name: "leave",
    aliases: ["leavevc", "lv"],
    cooldown: 7000,
    category: "Music",
    description: "Leave Voice Channel!",
    usage: "Leave",
    examples: ["leave"]
};