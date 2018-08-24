import { Router } from 'express';
import * as moviesController from '../controllers/MoviesController';

// Create a new router to handle /movies routes
const moviesRouter = Router();

// Ensure that POST, PUT, and PATCH methods only accept Content-Type: application/json bodies
moviesRouter.use((req, res, next) => {
    if (
        ['POST', 'PUT', 'PATCH'].indexOf(req.method) !== -1 &&
        !req.is('json')
    ) {
        return res.status(415).send('Content-Type must be application/json');
    }

    return next();
});

// GET /movies/
moviesRouter.get('/', moviesController.getMovies);

// GET /movies/welcome
moviesRouter.get('/welcome/:id', moviesController.getWelcome);

// GET /movies/:id
moviesRouter.get('/:id', moviesController.getMovie);

// POST /movies/new
moviesRouter.post('/new', moviesController.postMovie);

// PUT /movies/:id
moviesRouter.put('/:id', moviesController.putMovie);

export default moviesRouter;
