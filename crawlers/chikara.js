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
      const titles = $('.season-event-event-title a');
      const schedules = $('.event-date a span');
      const images = $('.season-event-poster a img');
      for(let i = 0, len = titles.length; i < len; i++) {
        const eventDateTime = schedules[i].children[0].data;
        firebase.database().ref('events/chikara/').push({
          name: titles[i].children[0].data,
          date: schedules[i].children[0].data,
          time: schedules[i].children[0].data,
          timestamp: new Date(schedules[i].children[0].data).getTime(),
          image: images[i].attribs.src,
          link: 'http://chikarapro.com/' + images[i].parent.attribs.href
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

c.queue('http://chikarapro.com/events/events');
