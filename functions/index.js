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


// Initialize Homegraph
const auth = new google.auth.GoogleAuth({
	scopes: ['https://www.googleapis.com/auth/homegraph'],
});
const homegraph = google.homegraph({
	version: 'v1',
	auth: auth,
});


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


// App Functions
const utils = require("./utils/utils");

app.onSync(utils.onSync);
app.onDisconnect(utils.onDisconnect);
app.onQuery(utils.onQuery);
app.onExecute(utils.onExecute);