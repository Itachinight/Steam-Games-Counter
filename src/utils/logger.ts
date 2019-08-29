import {promises, Stats} from 'fs';
const {writeFile, lstat, mkdir} = promises;

const checkLogDir = async (dir: string): Promise<void> => {
    try {
        const dirStat: Stats = await lstat(dir);
        if (!dirStat.isDirectory()) await mkdir(dir);
    } catch (err) {
        await mkdir(dir);
    }
};

export const writeGamesListToFile = async (gamesList: GameTotal[]): Promise<void> => {
    const dir = `./${process.env.LOG_DIR}` || './logs';
    const format = process.env.LOGGING;

    try {
        await checkLogDir(dir);

        let content: string = '';

        if (format === 'csv') {
            gamesList.forEach(game => {
                content += `${game.appid},${game.name},${game.qty}\r\n`
            });
        } else if (format === 'json') content = JSON.stringify(gamesList, null, 2);

        const date: Date = new Date();
        let dateArr: (string|number)[] = [
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
        ];
        dateArr = dateArr.map(elem => elem < 10 ? '0' + elem : elem);

        await writeFile(`${dir}/${dateArr.join('-')}.${format}`, content.trim());
    } catch (err) {
        console.log(err);
    }
};