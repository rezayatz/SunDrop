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



function addElement(list1) {
    var div = document.createElement('div');	
	var s = '<div class="alert alert-info" role="alert">';
	s+="List of files";
        for(i=0; i<list1.length; i++){
			if(i%4==0){
				s+=	'<div class="row">';
			}
				s+='<div class="col-sm-4 col-md-3"><div class="thumbnail text-center"><span class="glyphicon glyphicon-file" style="font-size: 6em;" aria-hidden="true"></span><div class="caption"><br/><p>'+list1[i]+'</p><p><button class="btn btn-primary" onclick="show(this)" id="'+list1[i]+'">Show</button></p></div></div></div>';

			if(i%4==3){
				s+=	'</div>';
			}
        }
s+=	'</div>';
    div.innerHTML = s;

     document.getElementById('content').appendChild(div);
}


function decrypt(text){
  var decipher = crypt.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

function show(elem){
	fs.readFile("downloadedFiles/"+elem.id, 'utf8', function(err, data) {
						  if (err) throw err;
						  window.alert(decrypt(data));
}
)};

$(document).ready(function(){
	fs.readdir("downloadedFiles", (err, dir)=>{
		addElement(dir);
  })
});

