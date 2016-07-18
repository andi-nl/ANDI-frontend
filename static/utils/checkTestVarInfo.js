#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var baby = require('babyparse');
var _ = require('lodash');


/**
 * Calculate md5 checksum of provided string
 *
 * @param {String} str
 * @returns {String} md5 checksum of provided string
 */
function checksum(str) {
  return crypto
    .createHash('md5')
    .update(str)
    .digest('hex')
}

/**
 * check if highweb is higher than lowweb
 *
 * @param {Array} data array of rows (objects with column names as keys)
 * @returns {Boolean} true if highweb is higher than lowweb, false otherwise
 */
function checkWebRange(data) {
  var valid = true;
  data.forEach(function (row) {
    var high = parseInt(row.highweb, 10);
    var low = parseInt(row.lowweb, 10);
    if (high <= low) {
      valid = false;
    }
  }, this);
  return valid;
};

/**
 * check if highborder is higher than lowborder
 *
 * @param {Array} data array of rows (objects with column names as keys)
 * @returns {Boolean} true if highborder is higher than lowborder, false otherwise
 */
function checkBorderRange(data) {
  var valid = true;
  data.forEach(function (row) {
    var high = parseInt(row.highborder, 10);
    var low = parseInt(row.lowborder, 0);
    if (high && low && (high <= low)) {
      valid = false;
    }
  }, this);
  return valid;
};

/**
 * Checks for one to one relationship between 'category'
 * and 'category.short.name'
 *
 * @param {Array} data array of rows (objects with column names as keys)
 * @returns {Boolean} true when there is one to one relationship
 *  false otherwise
 */
function checkCategories(csv) {
  var valid;
  var categories = _.reduce(csv, function (result, row) {
    result.push(row.category);
    return result;
  }, []);
  var uniqCategories = _.uniq(categories);

  var categoryNames = _.reduce(csv, function (result, row) {
    result.push(row['category.short.name']);
    return result;
  }, []);
  var uniqCategoryNames = _.uniq(categoryNames);

  var categoriesAndNames = _.reduce(csv, function (result, row) {
    result.push(row.category + " " + row['category.short.name']);
    return result;
  }, []);
  var uniqCategoriesAndNames = _.uniq(categoriesAndNames);

  if (uniqCategories.length === uniqCategoryNames.length &&
    uniqCategoryNames.length === uniqCategoriesAndNames.length) {
    valid = true;
  }
  else {
    valid = false;
  };
  return valid;
}

/**
 * Test variables with particular long.name.1 should belong to the same
 * category
 *
 * @param {Array} data array of rows (objects with column names as keys)
 * @returns {Boolean} true if test variables with particular long.name.1
 * all belong to same category, false otherwise
 */
function checkLongNameCategories(csv) {
  var valid = true;
  // get all unique long.name.1 values
  var longNames = _.reduce(csv, function (result, row) {
    result.push(row['long.name.1']);
    return result;
  }, []);
  var uniqLongNames = _.uniq(longNames);

  // check number of categories for each long.name.1
  uniqLongNames.forEach(function (longName) {
    var longNameCategories = _.reduce(csv, function (result, row) {
      if (row['long.name.1'] === longName) {
        result.push(row.category);
        return result;
      }
      else {
        return result;
      }
    }, []);
    var uniqLongNameCategories = _.uniq(longNameCategories);
    if (uniqLongNameCategories.lenght > 1) {
      valid = false;
    }
  }, this);
  return valid;
};

function validateCsv(csv) {
  // highweb higher than lowweb
  var webRangeValid = checkWebRange(csv);

  // highborder higher than lowborder
  var borderRangeValid = checkBorderRange(csv);

  // one to one relationship between category.short.name and category
  var categoriesValid = checkCategories(csv);

  // particular long.name.1 can only belong to one category but one category
  // can contain multiple Long.name.1
  var longNameCategoriesValid = checkLongNameCategories(csv);

  var valid = [
    webRangeValid, borderRangeValid,
    categoriesValid, longNameCategoriesValid
  ].every(function (el) {
    return el;
  });
  return valid;
};

function validateAndChecksum() {
  // validate csv
  var parsed = baby.parseFiles(path.join(dir, csvFiles[0]), { header: true });
  if (parsed.errors.length > 0) {
    console.log("There were errors while reading in the csv file:\n", parsed.errors);
  }
  var csv = parsed.data;
  var csvIsValid = validateCsv(csv);
  if (csvIsValid) { // generate checksum
    console.log('Test variable information is valid.');
    // generate checksum
    var csvString = fs.readFileSync(path.join(dir, csvFiles[0]), 'utf8');
    var md5 = checksum(csvString);
    // write checksum in the file with same name but .md5 extension
    var fname = path.basename(csvFiles[0], '.csv') + '.md5'
    fs.writeFileSync(path.join(dir, fname), md5);
    console.log('Checksum has been calculated and writen to .md5 file.')
  }
  else {
    console.log("There are errors in test variable information csv file");
  }
}

// check directory provided on the commmand line
var dir = process.argv[2];
var files = fs.readdirSync(dir);

// find all .csv files
var csvFiles = files.filter(function (file) {
  var isCsv = path.extname(file) === '.csv';
  return isCsv;
});

// if there is no .csv files or there is more than one,
// inform the user and quit
if (csvFiles.length === 0) {
  console.log('Provided path does not contain .csv files.');
  process.exit(1);
}
else if (csvFiles.length > 1) {
  console.log('There is more than one .csv file at provided path.')
  process.exit(1);
}

// check if there are any md5 files
var md5Files = files.filter(function (file) {
  var isMd5 = path.extname(file) === '.md5';
  return isMd5;
})

if (md5Files.length === 0) {
  validateAndChecksum();
}
else if (md5Files.length > 1) {
  console.log('More than one .md5 file avaliable at provided path.')
}
else {
  // check if checksum is valid for provided .csv file
  var csvString = fs.readFileSync(path.join(dir, csvFiles[0]), 'utf8');
  var md5 = checksum(csvString);
  var md5old = fs.readFileSync(path.join(dir, md5Files[0]), 'utf8');
  if (md5 === md5old) { // all fine checksum matches one calculate before
    console.log('Test variable info is valid and checksum is up to date.')
  }
  else {
    console.log('Checksums do not match, file will be validated and new ' +
      'checksum has been calculated and writen to .md5 file.')
    // delete the checksum, validate the file and generate new checksum
    fs.unlinkSync(path.join(dir, md5Files[0]));
    validateAndChecksum();
  }
  var a;
}
