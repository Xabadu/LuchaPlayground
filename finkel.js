const fs = require('fs');
const XLSX = require('xlsx');
const _ = require('lodash');
_.mixin(require('lodash-inflection'));

const FILE_PATH = process.argv[2];
const FILE_NAME = 'promotions.xlsx';

const workbook = XLSX.readFile(`${FILE_PATH}/promotions.xlsx`);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];

const promotions = XLSX.utils.sheet_to_json(worksheet);

let baseStructure = {};

promotions.forEach(function(promotion) {
  const tempObj = {};
  let imageFile = fs.readFileSync(`${FILE_PATH}/${promotion.logo}`);
  imageFile = new Buffer(imageFile, 'binary').toString('base64');
  tempObj[promotion.key] = promotion;
  tempObj[promotion.key].logo = `data:image/jpg;base64,${imageFile}`
  _.extend(baseStructure, tempObj);
});

const output = JSON.stringify(baseStructure);

fs.writeFile('./output/promotions.json', output, 'utf8', function(err) {
  if(err) {
    console.log(err);
  } else {
    console.log('File created');
  }
});
