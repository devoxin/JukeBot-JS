const bash = require('child_process');

exports.run = async function(client, msg, args) {
    if (!config.prop.owners.includes(msg.author.id)) return msg.channel.createMessage({ embed: {
        color: config.options.embedColour,
        title: ':warning: Restricted Command',
        description: 'This command is locked to the developer only.'
    }});

    if (!args[0]) return msg.channel.createMessage('No arguments passed');

    const m = await msg.channel.createMessage(`❯_ ${  args.join(' ')}`);
    bash.exec(`${args.join(' ')}`, async (e, stdout, stderr) => {
        if (e) return m.edit(`\`\`\`js\n${e.message}\n\`\`\``);
        if (stdout.length > 2000 || stderr.length > 2000) {
            console.log(stdout);
            console.error(stderr);
            m.edit(`❯_ ${args.join(' ')}\nOutput too big, check console.`);
        } else {
            if (!stdout && !stderr) return m.addReaction('\u2611');
            stdout && msg.channel.createMessage(`**Info**\n${  stdout !== '' ? `\`\`\`js\n${  stdout  }\`\`\`` : 'No information.'}`);
            stderr && msg.channel.createMessage(`**Errors**\n${  stderr !== '' ? `\`\`\`js\n${  stderr  }\`\`\`` : 'No errors.'}`);
        }
    });
};

exports.usage = {
    main: '{prefix}{command}',
    args: '',
    description: 'Developer command'
};
