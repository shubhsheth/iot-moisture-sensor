const functions = require('firebase-functions');


const login = (request, response) => {
    if (request.method === 'GET') {
        functions.logger.log('Requesting login page');
        response.send(`
		<html>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<body>
			<form action="/login" method="post">
			<input type="hidden"
				name="responseurl" value="${request.query.responseurl}" />
			<button type="submit" style="font-size:14pt">
				Link this service to Google
			</button>
			</form>
		</body>
		</html>
   		`);
    } else if (request.method === 'POST') {
        // Here, you should validate the user account.
        // In this sample, we do not do that.
        const responseurl = decodeURIComponent(request.body.responseurl);
        functions.logger.log(`Redirect to ${responseurl}`);
        return response.redirect(responseurl);
    } else {
        // Unsupported method
        response.send(405, 'Method Not Allowed');
    }
}

module.exports = login;