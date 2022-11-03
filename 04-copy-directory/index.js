import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'url';
import { rm } from 'node:fs/promises';
import { readdir } from 'node:fs/promises';
//import { access } from 'node:fs/promises';
import { copyFile } from 'node:fs/promises';
//import { deflate } from 'node:zlib';
class Copir {
  async copyDir(folder) {
    try {
      this.__dirname = path.dirname(fileURLToPath(import.meta.url));
      
      this.folder = folder;
      this.newFolder = folder + '-copy';
      this.pathToFolder = path.join( this.__dirname, this.folder);
      this.pathNewFolder = path.join(this.__dirname, this.newFolder);
      
      let isRemoved = undefined;
      
      await rm(this.pathNewFolder, {force: true, recursive: true})
        .then( async () => {
          const folderObject = await readdir(this.__dirname, { withFileTypes: true });
          if (isRemoved === undefined) {
            mkdir(this.pathNewFolder, { recursive: true }).then( this.copySubDir([undefined], folderObject[0] )); //TODO: fix the [0]
          }
        });
      
    }
    catch (err) {
      console.log('im outsider error');
      console.error(err);
    }
  }
  // node is file or directory
  async copySubDir(ancestorDir, node) {
    if (node.isFile() ) { 
      copyFile(path.join(this.__dirname, this.folder, ...ancestorDir, node.name), path.join(this.__dirname, this.newFolder, ...ancestorDir, node.name));
    }
    if ( !node.isFile() ) {
      const pathToNode = (ancestorDir[0] === undefined)?
        path.join(this.__dirname, this.folder):
        path.join(this.__dirname, this.folder, ...ancestorDir, node.name);
      
      if (ancestorDir[0] !== undefined){
        mkdir( path.join(this.__dirname, this.newFolder, ...ancestorDir, node.name),{ recursive: true } )
          .then(async () => {
            const children = await readdir(pathToNode, { withFileTypes: true });
            for (const child of children) {
              this.copySubDir(await this._developAncestor(ancestorDir, node.name), child);
            }
          });
      } else {
        const children = await readdir(pathToNode, { withFileTypes: true });
        for (const child of children) {
          this.copySubDir(await this._developAncestor(ancestorDir, node.name), child);
        }
      }
      
      
    }
  }
  async _developAncestor(ancestorDir, folder) {
    switch (ancestorDir[0]) {
    case undefined: return [''];
    default: return [...ancestorDir, folder];
    }
  }
}

const copir = new Copir;
copir.copyDir('files');