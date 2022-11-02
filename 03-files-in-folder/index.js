const path = require('path');
const fs = require('fs');

//let subfolderPath = path.join(__dirname,'secret-folder'); // this is also need to be promise
async function readStats(folder) {
  try {
    const pathToFolder = path.join(__dirname,folder);
    const files = await fs.promises.readdir(pathToFolder, { withFileTypes: true });
    for (const file of files)
      if (file.isFile()) {
        const statOfFile = await fs.promises.stat(path.join(pathToFolder,file.name));
        console.log(file.name, ' - ',
                    path.extname(path.join(pathToFolder,file.name)).substring(1),' - ',
                    statOfFile.size, ' bytes');  
      }
  } catch (err) {
    console.error(err);
  }
}
readStats('secret-folder');