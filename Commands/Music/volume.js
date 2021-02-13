module.exports.run = async (client, message, args, Discord) => {
    const Channel = message.member.voice.channel;
    if (!Channel) return message.channel.send("Error: No Voice Channel!");
    const Queue = client.queue.get(message.guild.id);
    if (!Queue) return message.channel.send("Error: No Queue, Please Add Some Songs By Using Play & Search Command!");
    let NewVolume = args[0];

    const Embed = new Discord.MessageEmbed()
        .setColor(client.Color)
        .setAuthor("Volume", message.author.avatarURL({
            dynamic: true
        }))
        .setDescription(`Current Volume - ${Queue.Volume}`)
        .setTimestamp();

    if (!NewVolume) return message.channel.send(Embed);
    if (isNaN(NewVolume) || parseInt(NewVolume) < 1) return message.channel.send("Error: Invalid Volume Provided!");
    NewVolume = parseInt(NewVolume);
    if (NewVolume > 150) return message.channel.send("Error: Volume Limit Surpassed - 150");
    if (NewVolume == Queue.Volume) return message.channel.send(`Error: Already ${NewVolume}!`);

    Queue.Volume = NewVolume;
    Queue.Connection.dispatcher.setVolumeLogarithmic(Queue.Volume / 100);

    const Embeded = new Discord.MessageEmbed()
        .setColor(client.Color)
        .setAuthor("Volume", message.author.avatarURL({
            dynamic: true
        }))
        .setDescription("Music Volume Has Been Changed - " + Queue.Volume + "!")
        .setTimestamp();

    return message.channel.send(Embeded);
};

module.exports.help = {
    name: "volume",
    aliases: ["v", "vl", "vol"],
    cooldown: 7000,
    category: "Music",
    description: "View Or Change Currently Playing Song Volume!",
    usage: "Volume | <New Volume>",
    examples: ["volume", "volume 124", "volume 50", "volume 136"]
};