import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'url';
import { rm } from 'node:fs/promises';
//import { copyFile } from 'node:fs/promises';
import { writeFile } from 'node:fs/promises';
import { readdir } from 'node:fs/promises';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


async function isCSS(pathToFolder) {
  try {
    const isCorrectExtName = path.extname(pathToFolder) === '.css'; 
    return isCorrectExtName;
  }
  catch (err) {
    console.error(err);
  }
}
async function isHTML(pathToFolder) {
  try {
    const isCorrectExtName = path.extname(pathToFolder) === '.html'; 
    return isCorrectExtName;
  }
  catch (err) {
    console.error(err);
  }
}
async function bundleStyles() {
  let pathToStyles = path.join(__dirname, 'styles');
  const files = await readdir(pathToStyles, { withFileTypes: true });
  const pathToBundleStyles = path.join(__dirname, 'project-dist', 'style.css');

  writeFile(pathToBundleStyles,'')
  .then( async () => {
    for (const file of files) {
      const isCSStype = await isCSS( path.join( pathToStyles, file.name) );
      const readStream = fs.createReadStream(path.join( pathToStyles, file.name), {encoding: 'utf8'});
      const writeStream = fs.createWriteStream(pathToBundleStyles, {flags:'a'});
      
      if (file.isFile() && isCSStype) {    
        readStream.on('data', chunk => {
          writeStream.write(chunk);
        });
        readStream.on('error', error => console.log('Error', error.message));
      }
    }
  });
}

async function buildStyles() {
  try {   
    const pathBundleFolder = path.join(__dirname, 'project-dist');
    
    //let isRemoved = undefined;
    
    await rm(pathBundleFolder, {force: true, recursive: true})
      .then( async () => {        
          mkdir(pathBundleFolder, { recursive: true })
          .then( bundleStyles ); 
      });
  }
  catch (err) {
    console.log('im outsider error');
    console.error(err);
  }
}
 async function findComponents() {   
  const pathComponents  = path.join(__dirname, 'components');
  const components = await readdir(pathComponents, { withFileTypes: true });
  let componentList = [];
  let componentNames = [];
  for (let component of components) {
    const pathComponent = path.join(pathComponents, component.name);
    if (component.isFile() && isHTML(component.name) ) {
      componentList.push(pathComponent);
      componentNames.push(component.name);
    } 
  }
  return { paths: componentList, names: componentNames};
}

async function readTemplate(templateName) {
  const pathToTemplate = path.join(__dirname, templateName);
  const streamReadTemplate = fs.createReadStream(pathToTemplate, 'utf-8');

  let htmlCode = '';
  streamReadTemplate.on('data', chunk => {
    htmlCode += chunk;
    console.log(typeof chunk); 
    //TODO: if the slot is cut by chunk this should not throw error
  });
}


buildStyles();

let promise = findComponents();
promise.then(
  result => console.log(result)
);
let promiseTemplate = readTemplate('template.html');
