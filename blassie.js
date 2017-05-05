const fs = require('fs');
const _ = require('lodash');
_.mixin(require('lodash-inflection'));

const IMAGE_PATH = process.argv[2];

const images = fs.readdirSync(IMAGE_PATH, 'utf8');

let baseStructure = { wrestlers: {} };

images.forEach(function(image) {
  const tempObj = {};
  const cleanKey = image.slice(0, -4);
  const slug = createSlug(cleanKey);
  let imageFile = fs.readFileSync(IMAGE_PATH + '/' + image);
  imageFile = new Buffer(imageFile, 'binary').toString('base64');
  tempObj[slug] = {
    key: slug,
    name: _.titleize(cleanKey.split('-').join(' ')),
    image: 'data:image/jpg;base64,' + imageFile
  }
  _.extend(baseStructure.wrestlers, tempObj);
});

const output = JSON.stringify(baseStructure);

fs.writeFile('wrestlers.json', output, 'utf8', function(err) {
  if(err) {
    console.log(err);
  } else {
    console.log('File created');
  }
});


function createSlug(key) {
  key = key.replace('$', 'S');
  return key.toLowerCase();
}
