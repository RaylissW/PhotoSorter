const fs = require('fs');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const mkdir = util.promisify(fs.mkdir);
const stat = util.promisify(fs.stat);

//var myPath = process.argv[2];
//console.log(process.argv);
var prev="";
var tek="";
var path='F:\\фото\\выгрузка 2019\\выгрузка';
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

/*
fs.readdir(path, function(err, items) {

  for (var i = 0; i < items.length; i++) {
    var file = path + '/' + items[i];
    var fileName = '' + items[i];
    console.log("Start: " + file);
    console.log("Fun: " + fileName);
    const stats = fs.statSync(file);
    tek = new Date(stats["mtime"]);
    tek = tek.getDate() + '.' + (tek.getMonth() + 1) + '.' + tek.getFullYear();
    //  console.log(tek);
    console.log(tek + '      ' + prev);
    if (tek !== prev) {
      console.log('да');
      if (readdir)
      fs.mkdirSync(path + '/' + tek);
      console.log('делаю папку ' + path + '/' + tek);
      move(path + '/' + fileName, path + '/' + tek + '/' + fileName, cb => (err));
      console.log('помещаю фото ' + path + '/' + tek + '/' + fileName);
      //  fs.writeFileSync(path+'/'+tek+'/'+fileName,data);
      prev = tek;
    } else {
      console.log('else ' + fileName);
      move(path + '/' + fileName, path + '/' + tek + '/' + fileName, cb => (err));
    }
    //else fs.writeFileSync(path+'/'+tek+'/'+fileName );


  }
});
*/

(async ()=>{

  const items = await readdir(path)
  for (let i = 0; i < items.length; i++) {
    const file = path + '/' + items[i];
    const fileName = '' + items[i];
    console.log("Start: " + file);
    console.log("Fun: " + fileName);
    const stats = await stat(file);
    tek = new Date(stats["mtime"]);
    tek = tek.getDate() + '.' + (tek.getMonth() + 1) + '.' + tek.getFullYear();
    //  console.log(tek);
    console.log(tek + '      ' + prev);
    if (tek !== prev) {
      console.log('да');
      try {
        await mkdir(path + '/' + tek);
      } catch (err){ move(path + '/' + fileName, path + '/' + tek + '/' + fileName, ()=>{});};
    //  await mkdir(path + '/' + tek);
      console.log('делаю папку ' + path + '/' + tek);
      move(path + '/' + fileName, path + '/' + tek + '/' + fileName, ()=>{});
      console.log('помещаю фото ' + path + '/' + tek + '/' + fileName);
      //  fs.writeFileSync(path+'/'+tek+'/'+fileName,data);
      prev = tek;
    } else {
      console.log('else ' + fileName);
      move(path + '/' + fileName, path + '/' + tek + '/' + fileName, ()=>{});
    }
    //else fs.writeFileSync(path+'/'+tek+'/'+fileName );
  }

})();