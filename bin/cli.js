#!/usr/bin/env node

/*!
* mutagrid-cli
* node.js Command Line Interface to transpile from Bootstrap to MutaGrid syntax
* https://github.com/mutable-tools/mutagrid-cli
* 2016 Jorge Epuñan | @csslab
* License: MIT
*/

var path      = require('path'),
    fs        = require('fs'),
    program   = require('commander'),
    inquirer  = require('inquirer'),
    pkg       = require(path.join(__dirname, '../package.json')),
    progress  = require('progress'),
    sluggin   = require('Sluggin').Sluggin,
    cheerio   = require('cheerio'),
    url       = require('url');

program
  .version(pkg.version)
  .parse(process.argv);

var replaceMapBootstrap = {
  'col-':'column-',
  '-xs':'-xsmall',
  '-sm':'-small',
  '-md':'-medium',
  '-lg':'-large'
};

var dataFromFile,
    filename    = './input/otro.html',
    outputPath  = './output/';


String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
}

/**
 * cleanName( uri );
 * @uri: string | uri
 * return string
 */
var cleanName = function( uri ){

  return sluggin( path.basename(uri).split('.')[0] );

}


/**
 * readFile( filename );
 * @filename: string | file whole path
 */
function readFile(filename){

  fs.readFile(filename, 'utf8', function (err ,data) {
    if (err) {
      return console.log(err + ' 👿');
    }
    dataFromFile = data

    var processData = findAndReplace(dataFromFile, replaceMapBootstrap);

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
function addMutaGridFile(data){

  var $ = cheerio.load(data);

  $('head').append('<link rel="stylesheet" href="http://mutable-tools.github.io/MutaGrid/mutagrid/dist/12/mutagrid.css" />');

  return $.html();

}


/**
 * findAndReplace( data, replaceMap );
 * @data: string | src html file
 * @replaceMap: object | key/value of elements to replace with
 * return string with src replaced
 */
function findAndReplace(data, replaceMap){

  for(key in replaceMap){
    data = data.replaceAll(key, replaceMap[key]);
  }
  return data;

}


/**
 * writeFile( replacedData );
 * @replacedData: string | src html file
 */
function writeFile(replacedData){

  var finalPath = outputPath + cleanName(filename) + '.html';

  fs.writeFile(finalPath, replacedData, function (err) {
    if (err) {
      return console.log(err + ' 👿');
    }
    console.log('Ya puedes revisar MutaGrid en ' + finalPath + '\n¡🍻 Salud!');
  });

}

// START!
readFile(filename);


