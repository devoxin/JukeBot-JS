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

        if (!stdout && !stderr) {
            return msg.channel.createMessage('Completed without result.');
        }

        if (stdout) {
            const pages = paginate(stdout, 1950);
            for (const page of pages) {
                await msg.channel.createMessage(`\`\`\`\n${page}\`\`\``);
            }
        }

        if (stderr) {
            const pages = paginate(stderr, 1950);
            for (const page of pages) {
                await msg.channel.createMessage(`\`\`\`\n${page}\`\`\``);
            }
        }
    });
};

function paginate(text, limit = 2000) {
    const lines = text.trim().split('\n');
    const pages = [];

    let chunk = '';

    for (const line of lines) {
        if (chunk.length + line.length > limit && chunk.length > 0) {
            pages.push(chunk);
            chunk = '';
        }

        if (line.length > limit) {
            const lineChunks = line.length / limit;

            for (let i = 0; i < lineChunks; i++) {
                const start = i * limit;
                const end = start + limit;
                pages.push(line.slice(start, end));
            }
        } else {
            chunk += `${line}\n`;
        }
    }

    if (chunk.length > 0) {
        pages.push(chunk);
    }

    return pages;
}

exports.usage = {
    main: '{prefix}{command}',
    args: '',
    description: 'Developer command'
};
