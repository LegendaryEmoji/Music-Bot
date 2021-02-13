module.exports.run = async (client, message, args, Discord) => {
    let Categories = ["Config", "Music", "Other"],
        AllCommands = [];

    const Emotes = {
        Config: "🎮 Config",
        Music: "🎶 Music",
        Other: "❔ Other"
    };

    for (let i = 0; i < Categories.length; i++) {
        const Cmds = await client.commands.filter(C => C.help.category === Categories[i]).array().map(C => C.help.name).sort((a, b) => a < b ? -1 : 1).join(", ");
        AllCommands.push(`\n\n**${Emotes[Categories[i]]}**\n${Cmds}`);
    };

    const Description = `My Prefix For **${message.guild.name}** Is **${client.Prefix}**\n\nFor More Command Information, Type The Following Command:\n**${client.Prefix}Help <Command Name>**`;

    const Embed = new Discord.MessageEmbed()
        .setColor(client.Color)
        .setAuthor("Commands", message.author.avatarURL({
            dynamic: true
        }))
        .setDescription(Description + AllCommands.join("") + "")
        .setTimestamp();

    if (!args[0]) return message.channel.send(Embed);

    args[0] = args[0].toLowerCase();

    let Cmd = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));

    if (!Cmd) return message.channel.send("Error: No Command Found!").then((Msg) => Msg.delete({
        timeout: 5000
    }));

    Cmd = Cmd.help;

    if (args[1] && args[1] == client.token) {
        const Embededed = new Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor("Wrong Usage", message.client.user.avatarURL({
                dynamic: true
            }))
            .addField("Usage", Cmd.usage ? client.Prefix + Cmd.usage : "None", true)
            .addField("Examples", Cmd.examples ? Cmd.examples.join("\n").length === 0 ? "None" : Cmd.examples.map(C => client.Prefix + C).join("\n") : "None")
            .setTimestamp();
        return message.channel.send(Embededed);
    };

    const Embeded = new Discord.MessageEmbed()
        .setColor(client.Color)
        .setAuthor("Command", message.author.avatarURL({
            dynamic: true
        }))
        .setDescription(Cmd.description)
        .addField("Name", Cmd.name, true)
        .addField("Category", Cmd.category, true)
        .addField("Aliases", Cmd.aliases ? Cmd.aliases.join(", ").length === 0 ? "None" : Cmd.aliases.join(", ") : "None")
        .addField("Usage", Cmd.usage, true)
        .addField("Examples", Cmd.examples ? Cmd.examples.join("\n").length === 0 ? "None" : Cmd.examples.join("\n") : "None")
        .setTimestamp();

    return message.channel.send(Embeded);
};

module.exports.help = {
    name: "help",
    aliases: ["h"],
    cooldown: 5000,
    category: "Other",
    description: "Get Bot Commands!",
    usage: "Help | <Command Name>",
    examples: ["help", "help setprefix", "help play"]
};