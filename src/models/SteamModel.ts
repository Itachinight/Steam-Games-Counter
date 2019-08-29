import fetch from 'node-fetch';

export default class SteamModel {
    private readonly apiKeys: string[];

    constructor(apiKeys: string[]) {
        this.apiKeys = apiKeys;
    }

    private async getOwnedGames(steamId: number): Promise<OwnedGamesResponse> {
        const key = this.apiKeys[Math.floor(Math.random() * this.apiKeys.length)];
        const link: string = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=${steamId}&include_appinfo=1`;
        const result = await fetch(link, {method: 'GET'});
        const {response} = await result.json();

        return response;
    };

    private static mapToArray(total: Map<number, GameTotalMapKey>): GameTotal[] {
        const totalArr: GameTotal[] = [];

        for (const [appid, value] of total) {
            const {qty, name} = value;
            totalArr.push({appid, name, qty})
        }

        return totalArr;
    }

    private static countGamesTotal (profiles: OwnedGamesResponse[]): GameTotal[] {
        const total: Map<number, GameTotalMapKey> = new Map();

        for (const profile of profiles) {
            const {games} = profile;
            if (games && games.length > 0) {
                for (const game of games) {
                    const {appid, name} = game;
                    if (!total.has(appid)) {
                        total.set(appid, {name, qty: 1})
                    } else {
                        const value: GameTotalMapKey = total.get(appid);
                        value.qty++;
                    }
                }
            }
        }

        return SteamModel.mapToArray(total);
    };

    public async getGamesList(set: Set<number>): Promise<GameTotal[]> {
        const gamesPromises: Promise<OwnedGamesResponse>[] = [];

        set.forEach(item => gamesPromises.push(this.getOwnedGames(item)));
        const games: OwnedGamesResponse[] = await Promise.all(gamesPromises);

        const totalArr: GameTotal[] = SteamModel.countGamesTotal(games);
        return totalArr.sort((a, b) => {
            if (b.qty < a.qty) return -1;
            if (b.qty > a.qty) return 1;

            if (b.name.toLowerCase() > a.name.toLowerCase()) return -1;
            if (b.name.toLowerCase() < a.name.toLowerCase()) return 1;

            return 0;
        });
    };
};