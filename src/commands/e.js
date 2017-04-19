const superagent = require("superagent");

exports.run = function (client, msg, args, guilds) {
	if (msg.author.id !== "180093157554388993") return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: ":warning: Restricted Command",
		description: "This command is locked to the developer only."
	}});

	try {
        let code = eval(args.join(" "));
        if (typeof code !== 'string')
        	code = require('util').inspect(code, {depth:0});
        code = code.replace(new RegExp(client.token.slice(4), "gi"), "*");
        msg.channel.createMessage(`\`\`\`js\n${code}\n\`\`\``);
    } catch(e) {
        msg.channel.createMessage(`\`\`\`js\n${e}\n\`\`\``);
    };
};

function setAvatar(client, url) {
	superagent.get(url).end((err, res) => {
		client.editSelf({
			avatar: `data:${res.header["content-type"]};base64,${res.body.toString("base64")}`
		});
	});
};

exports.usage = {
	main: "{prefix}{command}",
	args: "[ DEVELOPER COMMAND ]"
};
