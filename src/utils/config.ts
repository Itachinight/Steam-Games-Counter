import {readFileSync} from 'fs';

export const apiKeysParse = (): string[] => {
    try {
        const config = readFileSync('./config/keys.json', 'utf8');
        const {apiKeys} = JSON.parse(config);

        apiKeys.filter(key => key.length === 32);
        if (apiKeys.length === 0) process.exit();

        return apiKeys;
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};