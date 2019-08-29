import {Request, Response} from "express";
import {writeGamesListToFile} from "../utils/logger";
import {apiKeysParse} from "../utils/config";
import SteamModel from "../models/SteamModel";

export default class GamesController {
    private static readonly apiKeys: string[] = apiKeysParse();
    private static readonly logFormats = [
        'csv',
        'json'
    ];

    public static async renderGamesTable(req: Request, res: Response) {
        const {ids} = req.body;
        const set: Set<number> = new Set(ids);
        const steamModel: SteamModel = new SteamModel(GamesController.apiKeys);

        const gamesList = await steamModel.getGamesList(set);

        if (GamesController.logFormats.includes(process.env.LOGGING)) {
            writeGamesListToFile(gamesList);
        }

        res.render('table', {gamesList});
    }
}