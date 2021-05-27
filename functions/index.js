/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const functions = require('firebase-functions');
const { smarthome } = require('actions-on-google');
const { google } = require('googleapis');


// Initialize Firebase
const admin = require('firebase-admin');
admin.initializeApp();
const firebaseRef = admin.database().ref('/');


// Initialize Homegraph
const auth = new google.auth.GoogleAuth({
	scopes: ['https://www.googleapis.com/auth/homegraph'],
});
const homegraph = google.homegraph({
	version: 'v1',
	auth: auth,
});


// Hardcoded user ID
const USER_ID = '123';


// Initialize App
const app = smarthome();


// IOT Functions
const login = require("./routes/login");
const fakeauth = require("./routes/fakeauth");
const faketoken = require("./routes/faketoken");
const requestsync = require("./routes/requestsync")(homegraph);
const reportstate = require("./routes/reportstate")(homegraph);

exports.login = functions.https.onRequest(login);
exports.fakeauth = functions.https.onRequest(fakeauth);
exports.faketoken = functions.https.onRequest(faketoken);
exports.smarthome = functions.https.onRequest(app);
exports.requestsync = functions.https.onRequest(requestsync.request);
exports.reportstate = functions.database.ref('{deviceId}').onWrite(reportstate.report);




let devicelist
devicelist = require('./devices.json')
const deviceitems = JSON.parse(JSON.stringify(devicelist));

var devicecounter;

app.onSync((body) => {
	return {
		requestId: body.requestId,
		payload: {
			agentUserId: USER_ID,
			devices: [{
				id: 'washer',
				type: 'action.devices.types.WASHER',
				traits: [
					'action.devices.traits.OnOff',
					'action.devices.traits.StartStop',
					'action.devices.traits.RunCycle',
				],
				name: {
					defaultNames: ['My Washer'],
					name: 'Washer',
					nicknames: ['Washer'],
				},
				deviceInfo: {
					manufacturer: 'Acme Co',
					model: 'acme-washer',
					hwVersion: '1.0',
					swVersion: '1.0.1',
				},
				willReportState: true,
				attributes: {
					pausable: true,
				},
			}],
		},
	};
});


const queryFirebase = async (deviceId) => {
	const snapshot = await firebaseRef.child(deviceId).once('value');
	const snapshotVal = snapshot.val();

	var asyncvalue = {};

	if (Object.prototype.hasOwnProperty.call(snapshotVal, 'OnOff')) {
		asyncvalue = Object.assign(asyncvalue, { on: snapshotVal.OnOff.on });
	}
	if (Object.prototype.hasOwnProperty.call(snapshotVal, 'Brightness')) {
		asyncvalue = Object.assign(asyncvalue, { brightness: snapshotVal.Brightness.brightness });
	}
	if (Object.prototype.hasOwnProperty.call(snapshotVal, 'ColorSetting')) {
		asyncvalue = Object.assign(asyncvalue, { color: snapshotVal.ColorSetting.color });
	}
	if (Object.prototype.hasOwnProperty.call(snapshotVal, 'FanSpeed')) {
		if (Object.prototype.hasOwnProperty.call(snapshotVal.FanSpeed, 'currentFanSpeedSetting')) {
			asyncvalue = Object.assign(asyncvalue, { currentFanSpeedSetting: snapshotVal.FanSpeed.currentFanSpeedSetting });
		}
	}
	if (Object.prototype.hasOwnProperty.call(snapshotVal, 'SensorState')) {
		if (Object.prototype.hasOwnProperty.call(snapshotVal.SensorState, 'currentSensorStateData')) {
			asyncvalue = Object.assign(asyncvalue, { currentSensorStateData: snapshotVal.SensorState.currentSensorStateData });
		}
	}
	if (Object.prototype.hasOwnProperty.call(snapshotVal, 'Modes')) {
		if (Object.prototype.hasOwnProperty.call(snapshotVal.Modes, 'currentModeSettings')) {
			asyncvalue = Object.assign(asyncvalue, { currentModeSettings: snapshotVal.Modes.currentModeSettings });
		}
	}
	if (Object.prototype.hasOwnProperty.call(snapshotVal, 'TemperatureSetting')) {
		if (Object.prototype.hasOwnProperty.call(snapshotVal.TemperatureSetting, 'thermostatMode')) {
			asyncvalue = Object.assign(asyncvalue, { thermostatMode: snapshotVal.TemperatureSetting.thermostatMode });
		}
		if (Object.prototype.hasOwnProperty.call(snapshotVal.TemperatureSetting, 'thermostatTemperatureSetpoint')) {
			asyncvalue = Object.assign(asyncvalue, { thermostatTemperatureSetpoint: snapshotVal.TemperatureSetting.thermostatTemperatureSetpoint });
		}
		if (Object.prototype.hasOwnProperty.call(snapshotVal.TemperatureSetting, 'thermostatTemperatureAmbient')) {
			asyncvalue = Object.assign(asyncvalue, { thermostatTemperatureAmbient: snapshotVal.TemperatureSetting.thermostatTemperatureAmbient });
		}
		if (Object.prototype.hasOwnProperty.call(snapshotVal.TemperatureSetting, 'thermostatHumidityAmbient')) {
			asyncvalue = Object.assign(asyncvalue, { thermostatHumidityAmbient: snapshotVal.TemperatureSetting.thermostatHumidityAmbient });
		}
		if (Object.prototype.hasOwnProperty.call(snapshotVal.TemperatureSetting, 'thermostatTemperatureSetpointLow')) {
			asyncvalue = Object.assign(asyncvalue, { thermostatTemperatureSetpointLow: snapshotVal.TemperatureSetting.thermostatTemperatureSetpointLow });
		}
		if (Object.prototype.hasOwnProperty.call(snapshotVal.TemperatureSetting, 'thermostatTemperatureSetpointHigh')) {
			asyncvalue = Object.assign(asyncvalue, { thermostatTemperatureSetpointHigh: snapshotVal.TemperatureSetting.thermostatTemperatureSetpointHigh });
		}
	}
	return asyncvalue;
};

const queryDevice = async (deviceId) => {
	const data = await queryFirebase(deviceId);

	var datavalue = {};

	if (Object.prototype.hasOwnProperty.call(data, 'on')) {
		datavalue = Object.assign(datavalue, { on: data.on });
	}
	if (Object.prototype.hasOwnProperty.call(data, 'brightness')) {
		datavalue = Object.assign(datavalue, { brightness: data.brightness });
	}
	if (Object.prototype.hasOwnProperty.call(data, 'color')) {
		datavalue = Object.assign(datavalue, { color: data.color });
	}
	if (Object.prototype.hasOwnProperty.call(data, 'currentFanSpeedSetting')) {
		datavalue = Object.assign(datavalue, { currentFanSpeedSetting: data.currentFanSpeedSetting });
	}
	if (Object.prototype.hasOwnProperty.call(data, 'currentSensorStateData')) {
		datavalue = Object.assign(datavalue, { currentSensorStateData: data.currentSensorStateData });
	}
	if (Object.prototype.hasOwnProperty.call(data, 'currentModeSettings')) {
		datavalue = Object.assign(datavalue, { currentModeSettings: data.currentModeSettings });
	}
	if (Object.prototype.hasOwnProperty.call(data, 'thermostatMode')) {
		datavalue = Object.assign(datavalue, { thermostatMode: data.thermostatMode });
	}
	if (Object.prototype.hasOwnProperty.call(data, 'thermostatTemperatureSetpoint')) {
		datavalue = Object.assign(datavalue, { thermostatTemperatureSetpoint: data.thermostatTemperatureSetpoint });
	}
	if (Object.prototype.hasOwnProperty.call(data, 'thermostatTemperatureAmbient')) {
		datavalue = Object.assign(datavalue, { thermostatTemperatureAmbient: data.thermostatTemperatureAmbient });
	}
	if (Object.prototype.hasOwnProperty.call(data, 'thermostatHumidityAmbient')) {
		datavalue = Object.assign(datavalue, { thermostatHumidityAmbient: data.thermostatHumidityAmbient });
	}
	if (Object.prototype.hasOwnProperty.call(data, 'thermostatTemperatureSetpointLow')) {
		datavalue = Object.assign(datavalue, { thermostatTemperatureSetpointLow: data.thermostatTemperatureSetpointLow });
	}
	if (Object.prototype.hasOwnProperty.call(data, 'thermostatTemperatureSetpointHigh')) {
		datavalue = Object.assign(datavalue, { thermostatTemperatureSetpointHigh: data.thermostatTemperatureSetpointHigh });
	}
	return datavalue;
};

app.onQuery(async (body) => {
	const { requestId } = body;
	const payload = {
		devices: {},
	};

	const queryPromises = [];
	const intent = body.inputs[0];
	for (const device of intent.payload.devices) {
		const deviceId = device.id;
		queryPromises.push(
			queryDevice(deviceId)
				.then((data) => {
					// Add response to device payload
					payload.devices[deviceId] = data;
				}));
	}
	// Wait for all promises to resolve
	await Promise.all(queryPromises);
	return {
		requestId: requestId,
		payload: payload,
	};
});

const updateDevice = async (execution, deviceId) => {
	const { params, command } = execution;
	let state;
	let reference;
	switch (command) {
		case 'action.devices.commands.OnOff':
			state = { on: params.on };
			reference = firebaseRef.child(deviceId).child('OnOff');
			break;
		case 'action.devices.commands.BrightnessAbsolute':
			state = { brightness: params.brightness };
			reference = firebaseRef.child(deviceId).child('Brightness');
			break;
		case 'action.devices.commands.ColorAbsolute':
			state = { color: params.color };
			reference = firebaseRef.child(deviceId).child('ColorSetting');
			break;
		case 'action.devices.commands.SetFanSpeed':
			state = { currentFanSpeedSetting: params.fanSpeed };
			reference = firebaseRef.child(deviceId).child('FanSpeed');
			break;
		case 'action.devices.commands.SetModes':
			state = { currentModeSettings: params.updateModeSettings };
			reference = firebaseRef.child(deviceId).child('Modes');
			break;
		case 'action.devices.commands.ThermostatTemperatureSetpoint':
			state = { thermostatTemperatureSetpoint: params.thermostatTemperatureSetpoint };
			reference = firebaseRef.child(deviceId).child('TemperatureSetting');
			break;
		case 'action.devices.commands.ThermostatSetMode':
			state = { thermostatMode: params.thermostatMode };
			reference = firebaseRef.child(deviceId).child('TemperatureSetting');
			break;
		case 'action.devices.commands.ThermostatTemperatureSetRange':
			state = { thermostatTemperatureSetpointLow: params.thermostatTemperatureSetpointLow, thermostatTemperatureSetpointHigh: params.thermostatTemperatureSetpointHigh };
			reference = firebaseRef.child(deviceId).child('TemperatureSetting');
	}
	return reference.update(state)
		.then(() => state);
};

app.onExecute(async (body) => {
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
});

app.onDisconnect((body, headers) => {
	functions.logger.log('User account unlinked from Google Assistant');
	// Return empty response
	return {};
});