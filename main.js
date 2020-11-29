var fs = require('fs');

//var myPath = process.argv[2];
//console.log(process.argv);
var prev="";
var tek="";
var path='E:test';
//__dirname

function move(oldPath, newPath, callback) {

    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            if (err.code === 'EXDEV') {
                copy();
            } else {
                callback(err);
            }
            return;
        }
        callback();
    });

    function copy() {
        var readStream = fs.createReadStream(oldPath);
        var writeStream = fs.createWriteStream(newPath);

        readStream.on('error', callback);
        writeStream.on('error', callback);

        readStream.on('close', function () {
            fs.unlink(oldPath, callback);
        });

        readStream.pipe(writeStream);
    }
}


fs.readdir(path, function(err, items) {

    for (var i=0; i<items.length; i++) {
              var file = path + '/' + items[i];
              var fileName=''+items[i];
              //  console.log("Start: " + file);
             console.log("Fun: " + fileName);
             fs.stat(file, function(err, stats) {
             tek=new Date (stats["mtime"]);
             tek=tek.getDate()+'.'+(tek.getMonth()+1)+'.'+ tek.getFullYear();
                  //  console.log(tek);
                 console.log(tek+'      '+ prev);
                   if(tek!==prev){
                       console.log('да');
                                 //console.log(path+'/'+tek+'/'+fileName);
                         fs.mkdirSync(path+'/'+tek);
                                 console.log('делаю папку '+ path+'/'+tek);
                         move(path+'/'+fileName,path+'/'+tek+'/'+fileName,cb=>(err));
                                 console.log('помещаю фото '+ path+'/'+tek+'/'+fileName);
                                 //  fs.writeFileSync(path+'/'+tek+'/'+fileName,data);
                        prev=tek;
                   }
                   else {
                                 console.log('else '+fileName );
                         move(path + '/' + fileName, path + '/' + tek + '/' + fileName, cb => (err));
                   }
                                 //else fs.writeFileSync(path+'/'+tek+'/'+fileName );
         });
    }
});