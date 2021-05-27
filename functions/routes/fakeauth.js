const functions = require('firebase-functions');
const util = require('util');

const fakeauth = (request, response) => {
    const responseurl = util.format('%s?code=%s&state=%s',
        decodeURIComponent(request.query.redirect_uri),
        'xxxxxx',
        request.query.state);

    functions.logger.log(`Set redirect as ${responseurl}`);
    return response.redirect(`/login?responseurl=${encodeURIComponent(responseurl)}`);
}

module.exports = fakeauth;