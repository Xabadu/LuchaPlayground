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
      const titles = $('.tribe-events-list-event-title a');
      const schedules = $('.tribe-event-schedule-details span');
      const images = $('.tribe-events-event-image img');
      for(let i = 0, len = titles.length; i < len; i++) {
        const eventDateTime = schedules[i].children[0].data.split('@');
        firebase.database().ref('events/combat-zone-wrestling/').push({
          name: titles[i].attribs.title,
          date: eventDateTime[0].trim(),
          time: eventDateTime[1].trim(),
          timestamp: new Date(eventDateTime[0] + '2017').getTime(),
          image: images[i].attribs.src,
          link: images[i].parent.attribs.href
        })
        .then(function() {
          console.log('Agregado: ' + titles[i].attribs.title);
        })
        .catch(function(error) {
          console.log(error);
        });
      }
    }
    done();
  }
});

c.queue('http://www.czwrestling.com/events/');
