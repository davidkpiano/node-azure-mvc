import express from 'express';
import moviesRouter from './routers/MoviesRouter';
import * as path from 'path';
import { connect } from 'mongoose';

import * as dotenv from 'dotenv';

dotenv.config();

// Connect the database
// We'll remove the hardcoded URL later.
// const mongoUrl = 'mongodb://127.0.0.1:27017/moviesapp';
// connect(mongoUrl)
//     .then(() => {
//         console.log('Connected to MongoDB');
//     })
//     .catch(err => {
//         console.log('MongoDB connection error.');
//     });

// Creates a new Express app instance
const app = express();

// Sets up the view engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

// Parses JSON in body
app.use(express.json());

app.use('/', (req, res) => res.send('Hello world!'));

// Handles /movies routes
app.use('/movies', moviesRouter);

export { app };
