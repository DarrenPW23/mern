import express from 'express'
import path from 'path'

let app = express()
const PORT = process.env.PORT || 3000

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});