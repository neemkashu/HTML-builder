import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'url';
import { rm } from 'node:fs/promises';

async function copyDir (folder) {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const newFolder = folder + '-copy';
    const pathNewFolder = path.join( __dirname, newFolder);
    
    const isRemoved = await rm(pathNewFolder, { force: true, maxRetries: 0, recursive: true })
    
    if (isRemoved === undefined) {
      mkdir(pathNewFolder, { recursive: true });
    }
    // for (const file of files)
    //   if (file.isFile()) {
    //     const statOfFile = await stat(path.join(pathToFolder,file.name));
    //     console.log(file.name, ' - ',
    //                 path.extname(path.join(pathToFolder,file.name)).substring(1),' - ',
    //                 statOfFile.size, ' bytes');  
    //   }
  }
  catch (err) {
    console.error(err);
  }
}
copyDir('files');