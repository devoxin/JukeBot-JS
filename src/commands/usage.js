exports.run = function(client, msg, args, db) {

    if (!args[0]) return msg.channel.createMessage({ embed: {
        color: 0x1E90FF,
        title: "No command specified",
        description: `You need to specify a command\n(e.g. ${db.prefix}usage play)`
    }});

	try{
    	let usage = require(`./${args[0]}.js`).usage;
    	delete require.cache[require.resolve(`./${args[0]}.js`)];
    	msg.channel.createMessage({ embed: {
        	color: 0x1E90FF,
        	title: `${args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase()} Usage`,
        	description: `${usage.main.replace("{command}", args[0].toLowerCase()).replace("{prefix}", db.prefix)} ${usage.args}`
    	}});
	} catch(e) {
		if (e.message.includes("Cannot find module"))
			return msg.channel.createMessage({ embed: {
				color: 0x1E90FF,
				title: "Command not found"
			}});
		msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: "Error occurred while fetching usage",
			description: e.message
		}})
	}

}

exports.usage = {
	main: "{prefix}{command}",
	args: ""
};
