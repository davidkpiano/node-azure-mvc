import { Router } from 'express';
import * as moviesController from '../controllers/MoviesController';

// Create a new router to handle /movies routes
const moviesRouter = Router();

// GET /movies/
moviesRouter.get('/', moviesController.index);

// GET /movies/welcome
moviesRouter.get('/welcome', moviesController.getWelcome);

export default moviesRouter;
