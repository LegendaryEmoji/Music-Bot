/* Exporting & Making */

const { Default_Prefix, Color, Token } = require("./config.js");
const Discord = require("discord.js"), Client = new Discord.Client({ restTimeOffset: 10 }), CoolDowns = new Discord.Collection(), Fs = require("fs"), Ms = require("pretty-ms"), SC = require("soundcloud-scraper");
Client.commands = new Discord.Collection(), Client.aliases = new Discord.Collection(), Client.queue = new Map(), Client.Db = require("old-wio.db"), Client.Color = Color;

/* Command Handler */

const Categories = ["Config", "Music", "Other"];

Categories.forEach((Category) => {
   Fs.readdir(`./Commands/${Category}`, (error, Files) => {
      if (error) throw error;
      Files.forEach((File) => {
         if (!File.endsWith(".js")) return;
         const Cmd = require(`./Commands/${Category}/${File}`);
         if (!Cmd.help.name || !Cmd.help.aliases) return console.log(`${Cmd.help.name ? Cmd.help.name : "?"} Failed To Load - ❌`);
         Client.commands.set(Cmd.help.name, Cmd);
         Cmd.help.aliases ? Cmd.help.aliases.forEach(Alias => Client.aliases.set(Alias, Cmd.help.name)) : Cmd.help.aliases = null;
         console.log(`${Cmd.help.name} Has Been Loaded - ✅`)
      });
   });
});

/* Events */

Client.on("ready", async () => {
   console.clear();
   console.log(`Bot Is Ready To Play Music - ${Client.user.username}`);
   Client.user.setActivity("Playing Music :D", { type: "PLAYING" });
   const Key = await SC.keygen();
   Client.SC = new SC.Client(Key);
});

Client.on("error", (error) => {
   console.log(error);
});

Client.on("message", async (message) => {
   if (message.author.bot || !message.guild || message.webhookID) return;

   const Prefix = await Client.Db.fetch(`Prefix_${message.guild.id}`) || Default_Prefix;

   if (!message.content.startsWith(Prefix)) return;

   let Arguments = await message.content.slice(Prefix.length).trim().split(/ +/g), Command = await Arguments.shift().toLowerCase();

   Command = await Client.commands.get(Command) || await Client.commands.get(Client.aliases.get(Command));

   if (!Arguments || !Command) return;

   try {
      if (!CoolDowns.has(Command.help.name)) await CoolDowns.set(Command.help.name, new Discord.Collection());
      const Timestamps = CoolDowns.get(Command.help.name), CoolDown = parseInt(Command.help.cooldown || 1000), Now = Date.now();
      if (Timestamps.has(message.author.id)) {
        const ExpireTime = Timestamps.get(message.author.id) + CoolDown;
        if (Now < ExpireTime) {
          const Embed = new Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor("Slow Down", message.author.avatarURL({ dynamic: true }))
          .setDescription(`Please Wait **${Ms(ExpireTime - Now, { verbose: true, secondsDecimalDigits: 0 })}** Before Using ${Command.help.name.charAt(0).toUpperCase() + Command.help.name.slice(1)} Command Again`)
          .setTimestamp();
          return message.channel.send(Embed);
        };
      };
     Timestamps.set(message.author.id, Now);
     Client.Prefix = Prefix;
     await Command.run(Client, message, Arguments, Discord);
     await setTimeout(() => Timestamps.delete(message.author.id), CoolDown);
   } catch (error) {
     return message.channel.send("Something Went Wrong, Try Again Later").then(() => console.log(error));
   };
});

/* Login */

Client.login(Token).catch(() => console.log(new Error("Invalid Discord Bot Token Provided!")));