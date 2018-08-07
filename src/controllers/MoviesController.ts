import { Request, Response } from 'express';

export function index(req: Request, res: Response) {
    res.send('This is my default response..');
}

export function getWelcome(req: Request, res: Response) {
    res.send('This is my welcome response...');
}
