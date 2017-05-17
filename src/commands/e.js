const sf = require("snekfetch");
const fs = require("fs");

exports.run = function (client, msg, args) {
	if (msg.author.id !== "180093157554388993") return msg.channel.createMessage({ embed: {
		color: config.options.embedColour,
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

function setAvatar(client, url, local) {
	if (!local) {
		sf.get(url).end((err, res) => {
			client.editSelf({ avatar: `data:${res.header["content-type"]};base64,${res.body.toString("base64")}` });
		});
	} else {
		try {
			let data = fs.readFileSync(url);

			client.editSelf({ avatar: `data:image/png;base64,${data.toString("base64")}` });
		} catch(err) {
			console.log(err.message);
		}
	}
};

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Developer command"
};
