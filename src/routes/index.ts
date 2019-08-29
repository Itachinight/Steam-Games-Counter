import * as express from "express";
import GamesController from "../controllers/GamesController";

const router: express.Router = express.Router();

router.post('/api', GamesController.renderGamesTable);

export default router;