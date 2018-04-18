const https = require('https');
const { parse } = require('url');
const { stringify } = require('querystring');

function get(url, query = {}, headers = {}) {
    return new Promise((resolve, reject) => {
        url = parse(url);
        headers = Object.assign(headers, defaultHeaders);

        const qs = stringify(query);
        const { hostname, pathname } = url;
        const path = pathname + (qs.length > 0 ? `?${qs}` : '');

        const opts = {
            hostname,
            path,
            headers,
        };

        https.get(opts, (res) => {
            if (![200, 302].includes(res.statusCode)) return reject(`Status code not valid: ${res.statusCode}`);

            const chunks = [];

            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => {
                const concatenated = Buffer.concat(chunks).toString();

                try {
                    resolve(JSON.parse(concatenated));
                } catch(_) {
                    resolve(concatenated);
                }
            });
        }).on('error', reject);
    });
}

const defaultHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
};

exports.get = get;
