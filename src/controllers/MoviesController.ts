import { Request, Response, NextFunction } from 'express';
import Movie from '../models/Movie';

export function index(req: Request, res: Response) {
    // The second argument ({ title: ... }) will be passed to the view engine,
    // which will pass the data to the React component as props.
    res.render('movies/index', { title: 'Movies' });
}

export function getWelcome(req: Request, res: Response) {
    const { id } = req.params;
    const { name } = req.query;

    // res.send(`Hello ${name}, ID is: ${id}`);
    res.render('movies/index', { title: 'Movies' });
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
            return res.status(404);
        }

        return res.json(movie);
    } catch (e) {
        next(e);
    }
}

export async function postMovie(req: Request, res: Response) {
    try {
        const newMovie = new Movie(req.body);
        const savedMovie = await newMovie.save();

        return res.json(savedMovie);
    } catch (ex) {
        return res.status(400).send(ex.message);
    }
}
