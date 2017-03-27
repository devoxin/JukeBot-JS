const Discord = require("discord.js");
const config = require("./config.json");
const sharder = new Discord.ShardingManager("./JukeBot.js", {totalShards: "auto", respawn: true, token: config.token});

sharder.on('launch', shard => console.log("[SHARD INIT ]: " + shard.id));
sharder.spawn();
