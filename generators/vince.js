const fs = require('fs');
const _ = require('lodash');

const data = {
  promotions: require('../output/promotions.json'),
  wrestlers: require('../output/wrestlers.json')
};

const output = JSON.stringify(data);

fs.writeFile('../output/data.json', output, 'utf8', function(err) {
  if(err) {
    console.log(err);
  } else {
    console.log('File created');
  }
});
