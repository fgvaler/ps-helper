
import { readFile } from "fs/promises";

export type UsageStats = {
    [key: string]: {
        usage: number
    }
};

export const process_usage_stats = async () =>{
    const raw = await readFile('./src/data/raw_data/usage/usage-1825.txt', 'utf-8');

    const lines = raw.split("\n").slice(5, -1);

    const json_data: UsageStats = {};
    for(const line of lines){
        const words = line.split('|');
        json_data[words[2].trim()] = {
            usage: Number(words[3].trim().slice(0,-1))/100
        };
    };

    return json_data;
};

export type MovesetStats = {
    [key: string]: {
        'abilities': {
            'name': string,
            'usage': number
        }[],
        'items': {
            'name': string,
            'usage': number
        }[],
        'spreads': string[],
        'moves': {
            'name': string,
            'usage': number
        }[],
    }
};

export const process_movesets = async () => {
    const raw = await readFile('./src/data/raw_data/movesets-1825.txt', 'utf-8');

    const entries = raw
        .split('\n')
        .slice(1)
        .join('\n')
        .split("+----------------------------------------+ \r\n +----------------------------------------+ \r\n");


    const readAbility = (rawAbility: string) => {
        const words =  rawAbility.split(' ');
        return {
            name: words.slice(0, -1).join(' ').trim(),
            usage: Number(words.slice(-1)[0].slice(0, -1))/100
        };
    };
    const readItem = readAbility;
    const readMove = readAbility;


    const sets: MovesetStats = {};
    entries.forEach((raw_entry=>{
        const sections = raw_entry.split('\r\n +----------------------------------------+');
        const name = sections[0].split('|')[1].trim();
        const abilities = sections[2].split('|').join('').split('\n').map(x=>x.trim()).slice(2).map(readAbility);
        const items = sections[3].split('|').join('').split('\n').map(x=>x.trim()).slice(2).map(readItem);
        const spreads = sections[4].split('|').join('').split('\n').map(x=>x.trim()).slice(2);
        const moves = sections[5].split('|').join('').split('\n').map(x=>x.trim()).slice(2).map(readMove);
        sets[name] = {
            abilities,
            items,
            spreads,
            moves,
        };
    }));

    return sets;
};
