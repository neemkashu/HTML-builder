import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'url';
import { rm } from 'node:fs/promises';
import { writeFile } from 'node:fs/promises';
import { readdir } from 'node:fs/promises';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function isCorrectExt(pathToFolder, extention) {
  try {
    const isCorrectExtName = path.extname(pathToFolder) === extention; 
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
      const isCSStype = await isCorrectExt( path.join( pathToStyles, file.name), '.css' );
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

  let listComponents = {};

  for (let component of components) {
    const pathComponent = path.join(pathComponents, component.name);
    if (component.isFile() && isCorrectExt(component.name, '.html') ) {
      let name = path.parse(component.name).name;
      listComponents[name] = { path: pathComponent, fileName:  name};
    } 
  }
  
  return new Promise ((resolve, reject) => {
    resolve( listComponents );
  });

}
async function cutTemplate (htmlCode){

  let regexpPlaceHolder = /\{\{(.*?)\}\}/ig;
  let regexpSpaces = /[ ]{0,}\{\{/ig;

  let infoTemplate = {};
  let listPlaceHolders = htmlCode.match(regexpPlaceHolder);
  let listIndents = htmlCode.match(regexpSpaces);

  for (let i = 0; i < listPlaceHolders.length; i++) {
    const element = listPlaceHolders[ i ];
    const indent = listIndents[ i ];
    let length = element.length;
    let indentLength = indent.length;

    let name = element.slice(2, length - 2);
    let indentString = indent.slice(0, indentLength - 2);
    infoTemplate[name] = { placeHolder: element, indents: indentString }
  }

  return infoTemplate;
}
async function readHTML(pathHTML) {
  const streamReadTemplate = fs.createReadStream(pathHTML, 'utf-8');

  let htmlCode = '';

  return new Promise ((resolve, reject) => {
    streamReadTemplate.on('data', chunk => {
      htmlCode += chunk; //TODO: if the slot is cut by chunk this should not throw error
    });
    streamReadTemplate.on('error', (err) => reject(err));
    streamReadTemplate.on('end', () => resolve(htmlCode));
  });
}
async function insertComponents() {
  let promiseTemplateCode = await readHTML(path.join (__dirname,'template.html'));
  const infoPlaceHolders = await cutTemplate( promiseTemplateCode );
  const listComponents = await findComponents();
  const pathBundleHTML = path.join(__dirname, 'project-dist', 'index.html');

  for (let component in listComponents) {
    const componentContent = await readHTML(listComponents[component].path);
    const placeHolderStr = infoPlaceHolders[component].placeHolder;
    const indentStr = infoPlaceHolders[component].indents;

    let linesOfCode = componentContent.split(String.fromCharCode(13)+String.fromCharCode(10));
    
    let linesWithSpaces = [];
    linesWithSpaces.push(linesOfCode[0]);
    for (let i = 1; i < linesOfCode.length; i++ ){
      let line = linesOfCode[ i ];
      linesWithSpaces.push(indentStr + line);
    }

    let contentWithIndents = linesWithSpaces.join(`${String.fromCharCode(13)}${String.fromCharCode(10)}`);

    promiseTemplateCode = promiseTemplateCode.replace(placeHolderStr,contentWithIndents);
  }

  writeFile(pathBundleHTML,'')
  .then( async () => {
    const writeStream = fs.createWriteStream(pathBundleHTML, {flags:'a'});
    writeStream.write(promiseTemplateCode);
  }
  );
}

buildStyles();
insertComponents();
