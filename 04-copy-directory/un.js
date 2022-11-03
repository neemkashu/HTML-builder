import path from 'node:path';
import { fileURLToPath } from 'url';
import { rm } from 'node:fs/promises';


const folder = 'files';
const newFolder = folder + '-copy';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pathNewFolder = path.join(__dirname, newFolder);
rm(pathNewFolder, {force: true, recursive: true})
  .then(console.log('folder deleted'))
  .catch(console.log('folder not deleted'));