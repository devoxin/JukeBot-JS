const fs = require("fs");

exports.run = function(client, msg, args, guilds) {

    if (!args[0]) return msg.channel.createMessage({ embed: {
        color: 0x1E90FF,
        title: "No command specified",
        description: `You need to specify a command\n(e.g. ${guilds[msg.guild.id].prefix}usage play)`
    }});

    if (msg.author.id !== "180093157554388993") return msg.channel.createMessage({ embed: {
        color: 0x1E90FF,
        title: "Placeholder",
        description: "This command is coming soon. It will allow you to view in-depth help for each command."
    }});

    if (!fs.existsSync(`./commands/${args[0]}.js`)) return msg.channel.createMessage({ embed: {
        color: 0x1E90FF,
        title: "Command Not Found",
        description: "Are you sure you typed it right?"
    }});

    let usage = require(`./${args[0]}.js`).usage;
    delete require.cache[require.resolve(`./${args[0]}.js`)];
    msg.channel.createMessage({ embed: {
        color: 0x1E90FF,
        title: `${args[0].charAt(0).toUpperCase() + args[0].slice(1)} Usage`,
        description: `${usage.main.replace("{command}", args[0]).replace("{prefix}", guilds[msg.guild.id].prefix)} ${usage.args}`
    }});

}

exports.usage = {
	main: "{prefix}{command}",
	args: ""
};
