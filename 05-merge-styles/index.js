import path from 'node:path';
import { fileURLToPath } from 'url';
import { writeFile } from 'node:fs/promises';
import { readdir } from 'node:fs/promises';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function writeBundle() {
  let pathToFolder = path.join(__dirname, 'styles');
  const files = await readdir(pathToFolder, { withFileTypes: true });
  
  //TODO: need to unsure that write file is before FOR cycle
  writeFile(path.join(__dirname, 'project-dist', 'bundle.css'),'')
  .catch( err => console.error(err) );   

  for (const file of files) {
    const readStream = fs.createReadStream(path.join(__dirname, 'styles', file.name), {encoding: 'utf8'});
    const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), {flags:'a'});
    
    if (file.isFile() && path.extname(file.name) === '.css') {    
      readStream.on('data', chunk => {
        writeStream.write(chunk);
      });
      readStream.on('error', error => console.log('Error', error.message));
    }
  }
}

writeBundle();