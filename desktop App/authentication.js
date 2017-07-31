var username;
var password;
var clientId = "acme";
var clientSecret = "acmesecret"; 
var neadedToken;
var token_ 

const path = require('path');
const url = require('url');
const remote = require('electron').remote;
var mainWindow=remote.getCurrentWindow();
var fs = require('fs');

$(document).ready(function(){
	
		$.ajax
		  ({
			method: "POST",
			url: "http://localhost:6985/oauth/token",
			beforeSend: function (xhr) {
				xhr.setRequestHeader ("Authorization", "Basic " + btoa(clientId + ":" + clientSecret));},
			data: {
				grant_type: 'client_credentials'
			},
			success: function (d){
				console.log(d.access_token);
				key = d.access_token; //store the value of the accesstoken
				token_ = key;
			}
		});
		
	document.getElementById("register-btn").addEventListener('click', function(){
		username = $("#inputEmail").val();
		password = $("#inputPassword").val();
		$.ajax
		  ({
			type: "PUT",
			url: "http://localhost:6985/api/user/?username",
			contentType: 'application/json',
			beforeSend: function (xhr) {
				xhr.setRequestHeader ("Authorization", "Bearer " + token_);},
			data: JSON.stringify({
				username: username,
				password: btoa(password)
			}),
			success: function (d){
				console.log(d);
			}
		});
	});	
	
	document.getElementById("login-btn").addEventListener('click', function(){
		username = $("#inputEmail").val();
		password = $("#inputPassword").val(); 
		$.ajax
		  ({
			type: "POST",
			url: "http://localhost:6985/oauth/token",
			beforeSend: function (xhr) {
				xhr.setRequestHeader ("Authorization", " Basic " + btoa(clientId + ":" + clientSecret));},
			data: {
				grant_type:	'password',
				username: username,
				password: btoa(password)
			},
			success: function (d){
				neadedToken = d.access_token;
				fs.writeFile("token.txt", neadedToken, function(err) {
					if(err) {
						return console.log(err);
					}

					console.log("The file was saved!");
				}); 
				
					mainWindow.loadURL(url.format({
					pathname: path.join(__dirname, 'myFiles.html'),
					protocol: 'file:',
					slashes: true
				}));
				
			}
		});
	});	
});



