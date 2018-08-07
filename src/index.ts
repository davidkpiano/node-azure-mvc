import express from 'express';

// Creates a new Express app instance
const app = express();

// Configures the http://localhost:5000/ route to send a text response
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Starts the app on port 5000, then calls the callback when
// the app successfully starts.
app.listen(5000, () => {
    console.log('Listening on port 5000: http://localhost:5000');
});
