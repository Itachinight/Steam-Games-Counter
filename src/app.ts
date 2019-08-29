import * as express from 'express';
import {Request, Response, NextFunction, Application} from "express";
import {config} from 'dotenv';
import router from "./routes";

config();

const port: number = parseInt(process.env.PORT);
const app: Application = express();

app.set('view engine', 'pug');
app.use(express.json());
app.use('/', express.static('public'));
app.use(router);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(404);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(500);
});

app.listen(port, () => console.log(`Server started on ${port}`));