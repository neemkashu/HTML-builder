import path from 'node:path';
import { fileURLToPath } from 'url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

fs.readFile(
  path.resolve(__dirname, 'text.txt'),
  'utf-8',
  (err, data) => {
    if (err) throw err;
    console.log(data);
  }
);
