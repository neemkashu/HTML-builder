import path from 'node:path';
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'url';
import { stat } from 'node:fs/promises';

async function readStats(folder) {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const pathToFolder = path.join( __dirname, folder);
    const files = await readdir(pathToFolder, { withFileTypes: true });

    for (const file of files)
      if (file.isFile()) {
        const statOfFile = await stat(path.join(pathToFolder,file.name));
        console.log(file.name, ' - ',
          path.extname(path.join(pathToFolder,file.name)).substring(1),' - ',
          statOfFile.size / 1024, 'KB');  
      }
  }
  catch (err) {
    console.error(err);
  }
}
readStats('secret-folder');