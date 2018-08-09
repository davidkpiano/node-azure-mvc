import { Request, Response } from 'express';

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
