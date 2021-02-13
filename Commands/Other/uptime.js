module.exports.run = async (client, message, args, Discord) => {
    let Days = Math.floor(client.uptime / 86400000),
        Hours = Math.floor(client.uptime / 3600000) % 24,
        Minutes = Math.floor(client.uptime / 60000) % 60,
        Seconds = Math.floor(client.uptime / 1000) % 60;
    const RemoveUseless = (Duration) => {
        return Duration.replace("0 Day\n", "").replace("0 Hour\n", "").replace("0 Minute\n", "");
    };
    let Total = await RemoveUseless(`${Days} ${Days > 1 ? "Days" : "Day"}\n${Hours} ${Hours > 1 ? "Hours" : "Hour"}\n${Minutes} ${Minutes > 1 ? "Minutes" : "Minute"}\n${Seconds} ${Seconds > 1 ? "Seconds" : "Second"}`);

    const Embed = new Discord.MessageEmbed()
        .setColor(client.Color)
        .setAuthor("Uptime", message.author.avatarURL({
            dynamic: true
        }))
        .setDescription(Total)
        .setTimestamp();

    return message.channel.send(Embed);
};

module.exports.help = {
    name: "uptime",
    aliases: ["ut"],
    cooldown: 7000,
    category: "Other",
    description: "Get Bot Uptime!",
    usage: "Uptime",
    examples: ["uptime"]
};