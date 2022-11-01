const path = require('path');
const fs = require('fs');

let subfolderPath = path.join(__dirname,'secret-folder');

fs.readdir(subfolderPath,  { withFileTypes: true }, (err, files) => {
  files.forEach( file => {
    let filePath = path.join(subfolderPath, file.name);
    if ( file.isFile() ) {
      fs.stat(filePath, (err, stats)=>{
        file.size = stats.size;
        console.log(file.name, ' - ', path.extname(filePath).substring(1),' - ', file.size, ' bytes');  
      });      
    }  
  });
});