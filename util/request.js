const https = require('https');
const { stringify } = require('querystring');

function get(url, query = {}, headers = {}) {
    return new Promise((resolve, reject) => {
        url = url.replace(/^https?:\/\//, '');

        const qs = stringify(query);
        const hostname = url.substring(0, url.indexOf('/'));
        const path = url.substring(url.indexOf('/')) + (qs.length > 0 ? `?${qs}` : '');

        const opts = {
            hostname,
            path,
            headers,
        };

        https.get(opts, (res) => {
            if (res.statusCode !== 200) return reject(res.statusCode);

            const chunks = [];

            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => {
                const concatenated = Buffer.concat(chunks).toString();

                try {
                    resolve(JSON.parse(concatenated))
                } catch(_) {
                    resolve(concatenated);
                }
            });
        })
        .on('error', reject);
    });
}

exports.get = get;
