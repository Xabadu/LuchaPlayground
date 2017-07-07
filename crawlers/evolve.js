const firebase = require('firebase');
const Crawler = require('crawler');
const config = require('../config');

firebase.initializeApp(config.firebase);

const c = new Crawler({
  maxConnections: 10,
  callback: function(error, res, done) {
    if(error)
      console.log(error);
    else {
      const $ = res.$;
      const titles = $('.noo-shevent-content h4 a');
      const schedules = $('.sh-time-event i');
      const images = $('.noo-thumbnail a img');
      for(let i = 0, len = titles.length; i < len; i++) {
        const date = schedules[i].next.data.trim();
        firebase.database().ref('events/evolve-wrestling/').push({
          name: titles[i].children[0].data,
          date: date,
          time: date,
          timestamp: new Date(date).getTime(),
          image: images[i].attribs.src,
          link: images[i].parent.attribs.href
        })
        .then(function() {
          console.log('Agregado: ' + titles[i].children[0].data);
        })
        .catch(function(error) {
          console.log(error);
        });
      }
    }
    done();
  }
});

c.queue('http://wwnlive.com/evolve/?v=7516fd43adaa#events');
