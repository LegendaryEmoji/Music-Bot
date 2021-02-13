module.exports.run = async (client, message, args, Discord) => {
    const Channel = message.member.voice.channel;
    if (!Channel) return message.channel.send("Error: No Voice Channel!");
    const Queue = client.queue.get(message.guild.id);
    if (!Queue) return message.channel.send("Error: No Queue, Please Add Some Songs By Using Play & Search Command!");

    Queue.Loop = Queue.Loop ? false : true;

    const Embed = new Discord.MessageEmbed()
        .setColor(client.Color)
        .setAuthor(`${Queue.Loop ? "On" : "Off"}`, message.author.avatarURL({
            dynamic: true
        }))
        .setDescription(`Loop Has Been ${Queue.Loop ? "Enabled" : "Disabled"}!`)
        .setTimestamp();

    return message.channel.send(Embed);
};

module.exports.help = {
    name: "loop",
    aliases: ["lp", "l"],
    cooldown: 5000,
    category: "Music",
    description: "On Loop Or Off Loop!",
    usage: "Loop",
    examples: ["loop"]
};