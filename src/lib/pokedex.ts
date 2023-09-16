
import usage_stats from '@/data/processed_data/usage-1825.json';
import moveset_stats from '@/data/processed_data/movesets-1825.json'
import { MovesetStats, UsageStats } from './process_raw_data';
import { Pokedex } from './showdown/data/pokedex';
import { isLetter } from './utils';
import { toLower } from 'lodash';

const usage = usage_stats as UsageStats
const movesets = moveset_stats as MovesetStats

export type pokemonID = string;

export const LegalPokemon: pokemonID[] = Object.keys(usage).filter(x=>Object.keys(movesets).includes(x));
export const getUsage = (pokemon: pokemonID) => usage[pokemon].usage;
export const getMoveset = (pokemon: pokemonID) => movesets[pokemon];
export const getNumber = (pokemon: pokemonID) => Pokedex[convertToShowdownDexName(pokemon)].num

export const convertToShowdownDexName = (name: pokemonID) => {
    return name.split('').filter(isLetter).map(toLower).join('')
}

export const getSpriteDir = (name: pokemonID) => {
    return `/sprites/${getNumber(name)}.png`
}
