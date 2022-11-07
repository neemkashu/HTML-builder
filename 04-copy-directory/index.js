import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { rm } from 'node:fs/promises';
import { readdir } from 'node:fs/promises';
import { copyFile } from 'node:fs/promises';
import { stat } from 'node:fs/promises';

class Copir {
  
  async copyDir (oldPath, newPath){
    rm(newPath, {force: true, recursive: true})
    .then( async () => {
      mkdir(newPath, { recursive: true })
      .then(this.copySubDir(oldPath, newPath))
      .catch(err => console.error(err));
    });  
  }
  
  async copySubDir(oldPath, newPath) {
    const node = await stat(oldPath);

    if (node.isFile() ) { 
      copyFile(oldPath, newPath);
    }
    if ( node.isDirectory() ) {
        mkdir( newPath,{ recursive: true } )
          .then(async () => {
            const children = await readdir(oldPath, { withFileTypes: true });
            for (const child of children) {
              this.copySubDir(path.join(oldPath, child.name), path.join(newPath, child.name));
            }
          });
    }
  }
}
const __dir = path.resolve();
const pathOld = path.join(__dir,'04-copy-directory','files');
const pathNew = path.join(__dir,'04-copy-directory','files-copy');

const copir = new Copir();
copir.copyDir(pathOld, pathNew);