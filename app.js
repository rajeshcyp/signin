require('dotenv').config();
const express = require ('express'); 
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https')


const PORT = process.env.SERVER_PORT;
const HOST = process.env.SERVER_HOST;
const API_KEY = process.env.MAILCHIMP_API_KEY;
const LIST_ID = process.env.MAILCHIMP_LIST_ID;
const MAIL_HOST = process.env.MAILCHIMP_HOST;

const app = express(); 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


app.get("/", (req,res)=> {
	res.sendFile(__dirname + "/signup.html"); 
})


app.post("/failure", (req,res) => {
	res.redirect("/")
})


app.post("/", (req,res) => {
	const {firstName, lastName, email} = req.body; 
	console.log("POST in Action");
	console.log('FirstName : ', firstName); 
	console.log('LastName : ', lastName); 
	console.log('email : ', email); 

	var data = {
		members: [
		{
			email_address: email, 
			status: "subscribed", 
			merge_fields: {
				FNAME: firstName,
				LNAME: lastName
			}
		}
		]
	}

	var jsonData = JSON.stringify(data); 

	const URL = `${MAIL_HOST}/${LIST_ID}`;
	const authenticationString = 'rajesharv' + API_KEY; 

	const options = {
		method: 'POST', 
		auth: authenticationString
	}

	const reqst = https.request(URL, options, (response) => {

		if ( response.statusCode === 200 ) {
			res.sendFile(__dirname + "/success.html"); 
		}
		else {
			res.sendFile(__dirname + "/failure.html"); 	
		}

		console.log(response);
		response.on("Data from MailChimp", (dt) => {
			console.log(JSON.parse(dt)); 
		})
	})

reqst.write(jsonData);
reqst.end();

}); 

app.listen( PORT, () => {
	console.log ( `Server is running on port ${HOST}:${PORT} `)
}); 
