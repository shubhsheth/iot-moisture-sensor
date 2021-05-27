const functions = require('firebase-functions');

module.exports = function (homegraph) {
    var module = {};

    module.request = async function (request, response) {
        response.set('Access-Control-Allow-Origin', '*');
        functions.logger.info(`Request SYNC for user ${USER_ID}`);
        try {
            const res = await homegraph.devices.requestSync({
                requestBody: {
                    agentUserId: USER_ID,
                },
            });
            functions.logger.info('Request sync response:', res.status, res.data);
            response.json(res.data);
        } catch (err) {
            functions.logger.error(err);
            response.status(500).send(`Error requesting sync: ${err}`);
        }
    }

    return module;
}