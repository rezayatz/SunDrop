var dirName;
var id;
var uploadFile;
var uploadFileName;

var app = require('electron').remote; 
			var dialog = app.dialog;
			var fs = require('fs');
			var zlib = require('zlib');
			var crypt = require('crypto'),
				algorithm = 'aes-256-ctr',
				password = 'd6F3Efeq';


function updateFile(id){
		$("#parent").val(id); 
		$.ajax({
			type: "POST",
			url: "http://localhost:6985/api/file/",
			contentType: false,
			processData: false,
			beforeSend: function (xhr) {
				xhr.setRequestHeader ("Authorization", "Bearer " + globalOauth);},
			data: new FormData($('#upload-form')[0]),
			success: function (d){
				console.log(d);
			}
		});
}

function createDir(id){
	dirName = $("#dirName").val();
			console.log('salam');

		console.log(id);
		$.ajax({
			type: "PUT",
			url: "http://localhost:6985/api/directory/",
			contentType: 'application/json',
			beforeSend: function (xhr) {
				xhr.setRequestHeader ("Authorization", "Bearer " + globalOauth);},
			data: JSON.stringify({
				name: dirName,
				parentId: id
			}),
			success: function (d){
				console.log(d);
			}
		});
}

function addElement(list1, isDir) {
    var div = document.createElement('div');	
	var s = '<div class="alert alert-info" role="alert">';
if(isDir){s+="List of directories"}	
else
	s+="List of files";
        for(i=0; i<list1.length; i++){
			if(i%4==0){
				s+=	'<div class="row">';
			}
			if(!isDir)
				s+='<div class="col-sm-4 col-md-3"><div class="thumbnail text-center"><span class="glyphicon glyphicon-file" style="font-size: 6em;" aria-hidden="true"></span><div class="caption"><br/><p>'+list1[i].name+'</p><p><button class="btn btn-primary" onclick="download(this)" id="'+list1[i].id+'">Download</button></p></div></div></div>';
			else
				s+='<div class="col-sm-4 col-md-3"><div class="thumbnail text-center"><span class="glyphicon glyphicon-file" style="font-size: 6em;" aria-hidden="true"></span><div class="caption"><br/><p>'+list1[i].name+'</p><p><button class="btn btn-primary" onclick="openDir(this)" id="'+list1[i].id+'">Open</button></p></div></div></div>';

			if(i%4==3){
				s+=	'</div>';
			}
        }
s+=	'</div>';
    div.innerHTML = s;

     document.getElementById('content').appendChild(div);
}

function download(elem) {
	$.ajax({
			type: "GET",
			url: "http://localhost:6985/api/file/"+elem.id,
			beforeSend: function (xhr) {
				xhr.setRequestHeader ("Authorization", "Bearer " + globalOauth);},
			success: function (d){
				console.log(d);
				$.ajax
				  ({
					method: "GET",
					url: "http://localhost:6985/api/file/info/"+ elem.id,
					beforeSend: function (xhr) {
						xhr.setRequestHeader ("Authorization", " Bearer " + globalOauth);},
					success: function (da){
						console.log(da);
						var dir = './downloadedFiles';

						if (!fs.existsSync(dir)){
							console.log("here");

						fs.mkdirSync(dir);
						}						
						var logger = fs.createWriteStream(dir+"/"+da.name+".txt", {
							flags: 'a' // 'a' means appending (old data will be preserved)
							});
						logger.write(d);
						logger.end();
					}
				});
				
						console.log(decrypt(d));



				//var w = fs.createWriteStream('resp.enc');
				//w.write(d);
				//var r = fs.createReadStream('resp.enc');
				
				//var decrypt = crypt.createDecipher(algorithm, password)
				// unzip content
				//var unzip = zlib.createGunzip();
				// write file
				//var w = fs.createWriteStream('file.out.txt');
				//r.pipe(decrypt).pipe(w);
			}
		});
}

function openDir(elem) {
		$.ajax
	  ({
		method: "GET",
		url: "http://localhost:6985/api/directory/"+ elem.id,
		beforeSend: function (xhr) {
			xhr.setRequestHeader ("Authorization", " Bearer " + globalOauth);},
		success: function (d){
			console.log(d);	
			$("#create-btn").attr("onclick","createDir('"+elem.id+"')");
			$("#upload-btn").attr("onclick","updateFile('"+elem.id+"')");
			var breadcrumb = document.getElementById("b");
			var entry = document.createElement('li');
			entry.appendChild(document.createTextNode(d.name));
			breadcrumb.appendChild(entry);
		}
	});
	var myNode = document.getElementById("content");
	myNode.innerHTML = '';
	
	$.ajax
	  ({
		method: "GET",
		url: "http://localhost:6985/api/directory/listdir/"+ elem.id,
		beforeSend: function (xhr) {
			xhr.setRequestHeader ("Authorization", " Bearer " + globalOauth);},
		success: function (d){
						console.log(d);

			addElement(d, true);
		}
	});
	$.ajax
	  ({
		method: "GET",
		url: "http://localhost:6985/api/directory/listfile/"+ elem.id,
		beforeSend: function (xhr) {
			xhr.setRequestHeader ("Authorization", " Bearer " + globalOauth);},
		success: function (d){
			console.log(d);
			addElement(d,false);
		}
	});
}

function encrypt(text){
  var cipher = crypt.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text){
  var decipher = crypt.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

$(document).ready(function(){
	console.log(globalOauth);
	$.ajax
	  ({
		method: "PUT",
		url: "http://localhost:6985/api/me",
		beforeSend: function (xhr) {
			xhr.setRequestHeader ("Authorization", " Bearer " + globalOauth);},
		success: function (d){
			id= d.rootDir.id;
				$("#create-btn").attr("onclick","createDir('"+id+"')");
				$("#upload-btn").attr("onclick","updateFile('"+id+"')");
			$.ajax
			  ({
				method: "GET",
				url: "http://localhost:6985/api/directory/listdir/"+ d.rootDir.id,
				beforeSend: function (xhr) {
					xhr.setRequestHeader ("Authorization", " Bearer " + globalOauth);},
				success: function (d){
					console.log(d);
					addElement(d, true);
				}
			});
			$.ajax
			  ({
				method: "GET",
				url: "http://localhost:6985/api/directory/listfile/"+ d.rootDir.id,
				beforeSend: function (xhr) {
					xhr.setRequestHeader ("Authorization", " Bearer " + globalOauth);},
				success: function (d){
					console.log(d);
					addElement(d,false);
				}
			});
		}
	});
	
	var app = require('electron').remote; 
			var dialog = app.dialog;
			var fs = require('fs');
			var zlib = require('zlib');
			var crypt = require('crypto'),
				algorithm = 'aes-256-ctr',
				password = 'd6F3Efeq';

							
			document.getElementById('select-file').addEventListener('click',function(){
				dialog.showOpenDialog(function (fileNames) {
					if(fileNames === undefined){
						console.log("No file selected");
					}else{
						document.getElementById("actual-file").value = fileNames[0];
						fs.readFile(document.getElementById("actual-file").value, 'utf8', function(err, data) {
						  if (err) throw err;
						  console.log('OK: ' + document.getElementById("actual-file").value);
						  console.log(data);
						  var hw = encrypt(data);
						  fs.unlink('a.enc.txt', function(err){
								if (err) throw err;
							});
							var logger = fs.createWriteStream('a.enc.txt', {
							  flags: 'a' // 'a' means appending (old data will be preserved)
							})

							logger.write(hw);
							logger.end();
						});
						
						
				// input file
				//var r = fs.createReadStream(document.getElementById('actual-file').value);
				// zip content
				//					console.log(r);

				//var zip = zlib.createGzip();
				// encrypt content
				//var encrypt = crypt.createCipher(algorithm, password); 
				//var w = fs.createWriteStream('encryptedFile.enc');
				// start pipe
				
				//r.pipe(encrypt).pipe(w);					
				}
				}); 
			},false);	
});

