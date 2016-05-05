#!/usr/bin/env node

"use strict";

const path      = require('path'),
      fs        = require('fs'),
      program   = require('commander'),
      inquirer  = require('inquirer'),
      pkg       = require(path.join(__dirname, '../package.json')),
      progress  = require('progress'),
      sluggin   = require('Sluggin').Sluggin,
      cheerio   = require('cheerio');

program
  .version(pkg.version)
  .parse(process.argv);

const replaceMapBootstrap = {
  'col-':'column-',
  '-xs':'-xsmall',
  '-sm':'-small',
  '-md':'-medium',
  '-lg':'-large'
};

let dataFromFile;
const filename    = './input/otro.html';
const outputPath  = './output/';


String.prototype.replaceAll = function(search, replacement) {
  const target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
}

/**
 * cleanName( uri );
 * @uri: string | uri
 * return string
 */
const cleanName = uri => sluggin( path.basename(uri).split('.')[0] );


/**
 * readFile( filename );
 * @filename: string | file whole path
 */
function readFile(filename) {

  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
      return console.log(`${err} 👿`);
    }
    dataFromFile = data

    let processData = findAndReplace(dataFromFile, replaceMapBootstrap);

    processData = addMutaGridFile(processData);

    if(processData) {
      writeFile(processData)
    } else {
      console.log('Error processing HTML source 👿')
    }

  });

}


/**
 * addMutaGridFile( data );
 * @data: string | src html file
 * return string with new <link> added
 */
function addMutaGridFile(data) {

  const $ = cheerio.load(data);

  $('head').append(
    '<link rel="stylesheet" href="http://mutable-tools.github.io/MutaGrid/mutagrid/dist/12/mutagrid.css" />'
  );

  return $.html();

}


/**
 * findAndReplace( data, replaceMap );
 * @data: string | src html file
 * @replaceMap: object | key/value of elements to replace with
 * return string with src replaced
 */
function findAndReplace(data, replaceMap) {

  let key;
  for(key in replaceMap){
    data = data.replaceAll(key, replaceMap[key]);
  }
  return data;

}


/**
 * writeFile( replacedData );
 * @replacedData: string | src html file
 */
function writeFile(replacedData) {

  const finalPath = `${outputPath}${cleanName(filename)}.html`;

  fs.writeFile(finalPath, replacedData, err => {
    if (err) {
      return console.log(`${err} 👿`);
    }
    console.log(`Ya puedes revisar MutaGrid en ${finalPath}\n¡🍻 Salud!`);
  });

}

// START!
readFile(filename);


