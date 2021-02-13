const {
    Player
} = require("../../Player.js");

module.exports.run = async (client, message, args, Discord) => {
    const Channel = message.member.voice.channel;
    if (!Channel) return message.channel.send("Error: No Voice Channel!");
    const Queue = client.queue.get(message.guild.id);
    if (!Queue) return message.channel.send("Error: No Queue, Please Add Some Songs By Using Play & Search Command!");

    const Embed = new Discord.MessageEmbed()
        .setColor(client.Color)
        .setAuthor("Bassboost", message.author.avatarURL({
            dynamic: true
        }))
        .setDescription(`Bassboost Filter Has Been ${Queue.Filters["bassboost"] ? "Disabled (Song Maybe Backward)" : "Enabled (Song Maybe Ahead)"}!`)
        .setTimestamp();

    Queue.Filters["bassboost"] = !Queue.Filters["bassboost"]

    await Player(client, message, {
        Filter: true,
        Song: Queue.Songs[0]
    });

    return message.channel.send(Embed);
};

module.exports.help = {
    name: "bassboost",
    aliases: ["bb"],
    cooldown: 7000,
    category: "Music",
    description: "Add/Remove Bassboost Filter To/From Currently Playing Song!",
    usage: "Bassboost",
    examples: ["bassboost"]
};