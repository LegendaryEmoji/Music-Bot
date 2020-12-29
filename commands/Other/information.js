const {
  Default_Prefix,
  Color,
  Owner,
  Support,
  Donate
} = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "information",
  aliases: ["info"],
  category: "Other",
  description: "Give You Information About Song!",
  usage: "Information <Thing> | <Value>",
  run: async (client, message, args) => {
    
  }
};
