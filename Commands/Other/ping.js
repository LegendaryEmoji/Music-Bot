module.exports.run = (client, message) => {
    return message.channel.send(`Pong - ${client.ws.ping}ms`);
};

module.exports.help = {
    name: "ping",
    aliases: ["p"],
    cooldown: 7000,
    category: "Other",
    description: "Get Bot Ping!",
    usage: "Ping",
    examples: ["ping"]
};