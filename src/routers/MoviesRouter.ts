import { Router } from 'express';
import * as moviesController from '../controllers/MoviesController';

// Create a new router to handle /movies routes
const moviesRouter = Router();

// GET /movies/
moviesRouter.get('/', moviesController.index);

// GET /movies/welcome
moviesRouter.get('/welcome/:id', moviesController.getWelcome);

// POST /movies/new
moviesRouter.post('/new', moviesController.postMovie);

export default moviesRouter;
