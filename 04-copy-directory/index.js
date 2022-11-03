import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'url';
import { rm } from 'node:fs/promises';
import { readdir } from 'node:fs/promises';
import { stat } from 'node:fs/promises';
import { copyFile, constants } from 'node:fs/promises';

async function copyDir (folder) {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const newFolder = folder + '-copy';
    const pathToFolder = path.join( __dirname, folder);
    const pathNewFolder = path.join(__dirname, newFolder);
    
    async function copySubDir(node, ancestorDir) {
      if (node.isFile() ) { // node is file or directory
        copyFile(path.join(folder, ancestorDir, node.name), path.join(newFolder, ancestorDir, node.name));
      }
      if ( !node.isFile() ) {
        const children = await readdir(node, { withFileTypes: true });
        for (const child of children) {
          copySubDir(child, path.join(ancestorDir, node.name) );
        }
      }
    }
    const isRemoved = await rm(pathNewFolder, { force: true, maxRetries: 0, recursive: true });
    const folderObject = await readdir(pathToFolder, { withFileTypes: true });
    if (isRemoved === undefined) {
      mkdir(pathNewFolder, { recursive: true })
      .then( copySubDir(folderObject[0], __dirname ))
    }

    
  }
  catch (err) {
    console.error(err);
  }
}
copyDir('files');