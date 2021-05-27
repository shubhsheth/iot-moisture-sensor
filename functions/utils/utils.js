const functions = require('firebase-functions');


// Initialize Firebase
const admin = require('firebase-admin');
admin.initializeApp();
const firebaseRef = admin.database().ref('/');


// App Data
const USER_ID = '123';
const devices = JSON.parse(JSON.stringify(require('../devices.json')));


// Functions
const onSync = (body) => {
	return {
		requestId: body.requestId,
		payload: {
			agentUserId: USER_ID,
			devices: devices,
		},
	};
}

const onDisconnect = (body, headers) => {
	functions.logger.log('User account unlinked from Google Assistant');
	// Return empty response
	return {};
}

const onQuery = async (body) => {
	const { requestId } = body;
	const payload = {
		devices: {},
	};
	const queryPromises = [];
	const intent = body.inputs[0];
	for (const device of intent.payload.devices) {
		const deviceId = device.id;
		queryPromises.push(queryDevice(deviceId)
			.then((data) => {
				// Add response to device payload
				payload.devices[deviceId] = data;
			}
			));
	}
	// Wait for all promises to resolve
	await Promise.all(queryPromises);
	return {
		requestId: requestId,
		payload: payload,
	};
}

const onExecute = async (body) => {
	const { requestId } = body;
	// Execution results are grouped by status
	const result = {
		ids: [],
		status: 'SUCCESS',
		states: {
			online: true,
		},
	};

	const executePromises = [];
	const intent = body.inputs[0];
	for (const command of intent.payload.commands) {
		for (const device of command.devices) {
			for (const execution of command.execution) {
				executePromises.push(
					updateDevice(execution, device.id)
						.then((data) => {
							result.ids.push(device.id);
							Object.assign(result.states, data);
						})
						.catch(() => functions.logger.error('EXECUTE', device.id)));
			}
		}
	}

	await Promise.all(executePromises);
	return {
		requestId: requestId,
		payload: {
			commands: [result],
		},
	};
}

const queryFirebase = async (deviceId) => {
	const snapshot = await firebaseRef.child(deviceId).once('value');
	const snapshotVal = snapshot.val();
	return {
		on: snapshotVal.OnOff.on,
		temperatureSetpointCelsius: snapshotVal.TemperatureControl.temperatureSetpointCelsius
	};
};

const queryDevice = async (deviceId) => {
	const data = await queryFirebase(deviceId);
	return {
		on: data.on,
		temperatureSetpointCelsius: data.temperatureSetpointCelsius
	};
};

const updateDevice = async (execution, deviceId) => {
	const { params, command } = execution;
	let state; let ref;
	switch (command) {
		case 'action.devices.commands.OnOff':
			state = { on: params.on };
			ref = firebaseRef.child(deviceId).child('OnOff');
			break;
		case 'action.devices.commands.StartStop':
			state = { isRunning: params.start };
			ref = firebaseRef.child(deviceId).child('StartStop');
			break;
		case 'action.devices.commands.PauseUnpause':
			state = { isPaused: params.pause };
			ref = firebaseRef.child(deviceId).child('StartStop');
			break;
		case 'action.devices.commands.TemperatureControl':
			state = { temperatureSetpointCelsius: params.temperatureSetpointCelsius };
			ref = firebaseRef.child(deviceId).child('TemperatureControl');
			break;
	}

	return ref.update(state)
		.then(() => state);
};

module.exports = { onSync, onDisconnect, onQuery, onExecute };