const app = require('./app')
const router = require('./routes')
const EventEmitter = require('events')

require('./mutations')

global.events = new EventEmitter();

app.use(router);

app.get('/*', (req, res) => {
    res.sendFile(global.INDEXROUTE);
})