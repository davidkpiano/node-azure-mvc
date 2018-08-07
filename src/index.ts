import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(5000, () => {
    console.log('Listening on port 5000: http://localhost:5000');
});
