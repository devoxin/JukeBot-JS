exports.run = function (client, msg, args) {

	msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Become a patreon!",
		url  : "https://patreon.com/crimsonxv",
		description: "By becoming a patreon, you help keep the servers running & encourage me to continue developing new features",
		fields: [
			{
				name: "Donator Benefits",
				value: "*- Doubled playlist song importing limit (100 songs)\n" +
					   "*- No voicechannel timeout\n" +
					   "*- Patreon role in JukeBot's Support server\n" +
					   "\nMore benefits will be listed soon. Feel free to suggest some!",
				inline: true
			}
		],
		footer: {
			text: "Any benefits marked with * are still yet to be added. Early support is still appreciated!"
		}
	}})

}

exports.usage = {
	main: "{prefix}{command}",
	args: ""
};
