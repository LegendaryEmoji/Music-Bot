module.exports.run = async (client, message, args, Discord) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Error: Missing Permission (Manage Messages)");

    const Prefix = client.Prefix,
        NewPrefix = args[0];

    if (!NewPrefix) return client.commands.get("help").run(client, message, ["setprefix", client.token], Discord);
    if (Prefix == NewPrefix) return message.channel.send("Error: Same Prefix");
    if (NewPrefix.length > 10) throw new Error("Error: Prefix Length Limit Surpassed (10)");

    await client.Db.set(`Prefix_${message.guild.id}`, NewPrefix);

    const Embed = new Discord.MessageEmbed()
    .setColor(client.Color)
    .setAuthor("Prefix", message.author.avatarURL({ dynamic: true }))
    .setDescription(`Prefix Has Been Setted - ${NewPrefix}`)
    .setFooter(`Requested By ${message.author.username}`)
    .setTimestamp();

    return message.channel.send(Embed);
};

module.exports.help = {
    name: "setprefix",
    aliases: ["sp"],
    cooldown: 5000,
    category: "Config",
    description: "Set Prefix Of The Server!",
    usage: "Setprefix <Prefix>",
    examples: ["setprefix !", "setprefix P!"]
};