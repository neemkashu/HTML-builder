import path from 'node:path';
import { fileURLToPath } from 'url';
import fs from 'node:fs';
import { readdir } from 'node:fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));




async function writeBundle() {
  let pathToFolder = path.join(__dirname, 'styles');
  const files = await readdir(pathToFolder, { withFileTypes: true });

  fs.writeFile(  
    path.join(__dirname, 'project-dist', 'bundle.css'),
    '',
    (err) => {
      if (err) throw err;
    }
  );

  for (const file of files) {
    const isCSStype = await isCSS(file.name);
    const input = fs.createReadStream(path.join(__dirname, 'styles', file.name), {encoding: 'utf8'});
    const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), {flags:'a'});

    if (file.isFile() && isCSStype) {
      
      
      input.on('data', chunk => {

        output.write(chunk);
      });
      input.on('error', error => console.log('Error', error.message));

    }
    input.on('exit', () => {
      console.log('write next style to bundle');
      output.destroy();
    });
  }
}


async function isCSS(fileName) {
  try {
    const pathToFolder = path.join( __dirname, 'styles', fileName); 
    const isCorrectExtName = path.extname(pathToFolder) === '.css'; 
    return isCorrectExtName;
  }
  catch (err) {
    console.error(err);
  }
}

writeBundle();