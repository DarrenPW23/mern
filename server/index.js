const app = require('./app')

app.get('/*', (req, res) => {
    res.sendFile(global.INDEXROUTE);
})