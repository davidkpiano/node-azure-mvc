import express from 'express';
import moviesRouter from './routers/MoviesRouter';

// Creates a new Express app instance
const app = express();

// Handles /movies routes
app.use('/movies', moviesRouter);

// Starts the app on port 5000, then calls the callback when
// the app successfully starts.
app.listen(5000, () => {
    console.log('Listening on port 5000: http://localhost:5000');
});
