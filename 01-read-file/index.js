import path from 'node:path';
import { fileURLToPath } from 'url';
import fs from 'node:fs';
import { stdout } from 'node:process';

async function readFile() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const readableStream = fs.createReadStream(path.join(__dirname, "text.txt"),{encoding: 'utf8'});

  readableStream.pipe(stdout);
}

readFile();