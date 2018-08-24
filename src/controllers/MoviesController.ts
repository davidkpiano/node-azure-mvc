import { Request, Response, NextFunction } from 'express';
import Movie from '../models/Movie';

export function index(req: Request, res: Response) {
    // The second argument ({ title: ... }) will be passed to the view engine,
    // which will pass the data to the React component as props.
    res.render('movies/index', { title: 'Movies' });
}

export function getWelcome(req: Request, res: Response) {
    res.render('movies/index', { title: 'Movies' });
}

export async function getMovies(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { search, genre } = req.query;

    try {
        const query = {
            // Search query provided
            ...(search ? { $text: { $search: search || '' } } : undefined),
            // Genre query provided
            ...(genre ? { genre } : undefined)
        };

        const movies = await Movie.find(query).exec();

        return res.json(movies);
    } catch (e) {
        next(e);
    }
}

export async function getMovie(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { id } = req.params;

        const movie = await Movie.findById(id).exec();

        if (!movie) {
            return res.status(404).send('Movie not found');
        }

        return res.json(movie);
    } catch (e) {
        next(e);
    }
}

export async function postMovie(req: Request, res: Response) {
    try {
        // Create the new movie using the JSON data from the request body
        const newMovie = new Movie(req.body);

        // Persist the movie to the database
        const savedMovie = await newMovie.save();

        // Respond with the persisted data
        return res.json(savedMovie);
    } catch (ex) {
        // Catch any validation errors
        return res.status(400).send(ex.message);
    }
}

export async function putMovie(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, {
            new: true // ensure that the updatedMovie is the updated movie, not the found movie
        }).exec();

        return res.json(updatedMovie);
    } catch (ex) {
        return res.status(400).send(ex.message);
    }
}
