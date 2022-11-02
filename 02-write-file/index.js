import path from 'node:path';
import { fileURLToPath } from 'url';
import fs from 'node:fs';

const { stdout, stdin } = process;
let flagOfSIGINT = 0;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

stdout.write('Type a text and press ENTER\n');
fs.writeFile(
  
  path.resolve(__dirname, 'notes.txt'),
  '',
  (err) => {
    if (err) throw err;
  }
);
process.on('exit', () => {
  if (!flagOfSIGINT) stdout.write('The changes are saved in notes.txt');
});
process.on('SIGINT', () => {
  flagOfSIGINT++;
  stdout.write('The changes are saved in notes.txt');  
  process.exit();
});
stdin.on('data', data => {
  if (data.toString().slice(0,4) === 'exit') process.exit();
  fs.appendFile(
    path.resolve(__dirname, 'notes.txt'),
    data.toString(),
    (err) => {
      if (err) throw err;
    }
  );
});

