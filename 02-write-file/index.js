import path from 'node:path';
import { fileURLToPath } from 'url';
import {writeFile} from 'node:fs/promises';
import {appendFile} from 'node:fs/promises';
import readline from 'node:readline';

async function writeFromTerminal() {
  const { stdout, stdin } = process;
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const pathToNotes = path.resolve(__dirname, 'notes.txt');
  
  const rl = readline.createInterface({ input: stdin, output:stdout });

  stdout.write('Type a text and press ENTER\n');

  writeFile(pathToNotes,'')
  .catch( err => console.error(err));

  rl.on('line', (line) => {
    if (line.toString().slice(0,4) === 'exit') {
      stdout.write('Exit procedure. The changes are saved in notes.txt');
      rl.close();
    } else {
      appendFile(pathToNotes, line+'\n');
    }
  });

  rl.once('SIGINT', () => {
    stdout.write('The changes are saved in notes.txt');
    rl.close();
  });
}

writeFromTerminal();
