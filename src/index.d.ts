interface OwnedGamesResponse {
    game_count: number;
    games: Game[];
}

interface Game {
    appid: number;
    name: string;
}

interface GameTotal extends Game {
    qty: number;
}

interface GameTotalMapKey {
    name: string;
    qty: number;
}