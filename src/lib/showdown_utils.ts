
import usage_stats from '@/data/processed_data/usage-1825.json';
import moveset_stats from '@/data/processed_data/movesets-1825.json'
import { MovesetStats, UsageStats } from './process_raw_data';
import { Pokedex } from '@/lib/showdown/data/pokedex';
import { isLetter } from '@/lib/utils';
import toLower from 'lodash/toLower';
import { levenshteinEditDistance } from "levenshtein-edit-distance";
import sortBy from "lodash/sortBy";
import { Generations, Move, Pokemon, calculate } from '@ajhyndman/smogon-calc';
import { Teams } from '@/lib/showdown/sim/teams';


export const gen = Generations.get(9);

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
    return `/images/sprites/${getNumber(name)}.png`
}

export const closestPokemonName = (scuffed_name: string) => {
    const dist = (p:string)=>levenshteinEditDistance(scuffed_name, p, true)
    const closest = sortBy(LegalPokemon, dist)
    return closest[0];
}


export const importTeam = (rawTeam: string): Pokemon[] => {
    
    const convertMon = (mon: PokemonSet) => (new Pokemon(
        gen,
        mon.species,
        {
            ability: mon.ability,
            item: mon.item,
            nature: mon.nature,
            ivs: mon.ivs,
            evs: mon.evs,
            moves: mon.moves,
        }
    ));
    const team = Teams.import(rawTeam);
    if(!team){
        throw new Error('failed to import teams');
    };
    return team.map(convertMon);
};

export const damageRange = (attacker: Pokemon, defender: Pokemon, move: string) => {
    const result = calculate(
        gen,
        attacker,
        defender,
        new Move(gen, move)
    );
    let min: number;
    let max: number;
	if (typeof(result.damage) === 'number'){
		min = result.damage;
        max = result.damage;
	} else {
		min = result.damage[0] as number;
        max = result.damage[result.damage.length - 1] as number;
	}
    const cap_at_1 = (num: number) => num > 1 ? 1 : num;
    min = cap_at_1(min/defender.stats.hp);
    max = cap_at_1(max/defender.stats.hp);
    return { min, max };
}

