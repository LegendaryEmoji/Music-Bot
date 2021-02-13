const {
    Player
} = require("../../Player.js");

module.exports.run = async (client, message, args) => {
    const Channel = message.member.voice.channel;
    if (!Channel) return message.channel.send("Error: No Voice Channel!");
    let Queue = await client.queue.get(message.guild.id),
        Connection;
    if (!Queue) return message.channel.send("Error: No Queue, Please Add Some Songs By Using Play & Search Command!");
    if (Queue.Voice.id != Channel.id) return message.channel.send("Error: Need To Be In Same Voice Channels!");
    const Wait = await message.channel.send("Cleaning...");
    await message.guild.voice.kick(), await client.queue.delete(message.guild.id);
    await Wait.edit("Successfully Left The Voice Channel & Deleted Queue From Database");

    Wait.edit("Configurations...");

    setTimeout(async () => {
        try {
            Connection = await Channel.join();
            await Connection.voice.setSelfDeaf(true);
            Queue["Connection"] = Connection;
        } catch (e) {
            console.log(e);
            return Wait.edit("Configuration Failed - Unable To Join Voice Channel!");
        };
        await Wait.edit("Configuration Success - Joined The Voice Channel");
        await client.queue.set(message.guild.id, Queue);
        try {
            await Player(client, message, {
                Song: Queue.Songs[0]
            });
        } catch (e) {
            console.log(e);
            return Wait.edit("Configuration Failed - Player Error");
        };
        await Wait.edit("Configuration Success - Player Running").then((M) => M.delete({
            timeout: 3000
        }));
        return message.react("✅");
    }, 3000);
};

module.exports.help = {
    name: "clean",
    aliases: ["cn"],
    cooldown: 10000,
    category: "Music",
    description: "Make Music More Clear!",
    usage: "Clean",
    examples: ["clean"]
};