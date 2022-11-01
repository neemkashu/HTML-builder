const path = require('path');
const fs = require('fs');

let subfolderPath = path.join(__dirname,'secret-folder');

const files = fs.readdir(subfolderPath,  { withFileTypes: true }, (err, files) => {
  console.debug(err, files);
});