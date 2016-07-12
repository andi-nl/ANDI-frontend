#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var baby = require('babyparse');

function checksum(str) {
  return crypto
    .createHash('md5')
    .update('utf8')
    .digest('hex')
}

function validateCsv(csvFile) {
  // highweb higher than lowweb

  // highborder higher than lowborder

  // one to one relationship between category.short.name and category

  // particular Long.name.1 can only belong to one category but one category
  // can contain multiple Long.name.1
};

// check directory provided on the commmand line
var dir = process.argv[2];
var files = fs.readdirSync(dir);

// find all .csv files
var csvFiles = files.filter(function (file) {
  var isCsv = path.extname(file) === '.csv';
  return isCsv;
});

// if no .csv files or more than one, give feedback to the user
if (csvFiles.length === 0) {
  console.log('Provided path does not contain .csv files.');
  process.exit(1);
}
else if (csvFiles.length > 1) {
  console.log('There is more than one .csv file at provided path.')
  process.exit(1);
}

var validMd5 = false;
var md5Files = files.filter(function (file) {
  var isMd5 = path.extname(file) === 'md5';
  return isMd5;
})

if (md5Files.length === 0) {
  // validate csv and generate checksum
  var parsed = baby.parseFiles(csvFiles[0], { header: true });
}
else if (md5Files.length > 1) {
  console.log("More than one .md5 file avaliable at provided path.")
  process.exit(1);
}
else {
  // check if checksum is valid for provided .csv file
  var fileString = fs.readFileSync(csvFiles[0]);
}
