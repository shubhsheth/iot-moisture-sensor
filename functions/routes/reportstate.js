const functions = require('firebase-functions');

const USER_ID = '123';

module.exports = function (homegraph) {
    var module = {};

    module.report = async function (change, context) {
        functions.logger.info('Firebase write event triggered Report State');
        const snapshot = change.after.val();

        const requestBody = {
            requestId: 'ff36a3cc', /* Any unique ID */
            agentUserId: USER_ID,
            payload: {
                devices: {
                    states: {
                        /* Report the current state of our washer */
                        [context.params.deviceId]: {
                            on: snapshot.OnOff.on,
                            isPaused: snapshot.StartStop.isPaused,
                            isRunning: snapshot.StartStop.isRunning,
                        },
                    },
                },
            },
        };

        const res = await homegraph.devices.reportStateAndNotification({
            requestBody,
        });
        functions.logger.info('Report state response:', res.status, res.data);
    }

    return module;
};