
import { Generations, Move, Pokemon, calculate } from '@ajhyndman/smogon-calc';
import { Teams } from '@/lib/showdown/sim/teams';
import { toLower } from 'lodash';
import { getNumber, pokemonID } from './pokedex';
import cloneDeep from 'lodash/cloneDeep'


export const gen = Generations.get(9);

export const import_team = (raw_team: string): Pokemon[] => {
    
    const convert_mon = (mon: PokemonSet) => (new Pokemon(
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
    const team = Teams.import(raw_team);
    if(!team){
        throw new Error('failed to import teams');
    };
    return team.map(convert_mon);
};

export const max_damage = (attacker: Pokemon, defender: Pokemon, move: string) => {
    return damage_range(attacker, defender, move).max;
}

export const min_damage = (attacker: Pokemon, defender: Pokemon, move: string) => {
    return damage_range(attacker, defender, move).min;
}

export const damage_range = (attacker: Pokemon, defender: Pokemon, move: string) => {
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

export const isLetter = (str:string) => {
    return str.length === 1 && str.match(/[a-z]/i);
}

export const convertToShowdownDexName = (name: pokemonID) => {
    return name.split('').filter(isLetter).map(toLower).join('')
}

export const getSpriteDir = (name: pokemonID) => {
    return `/sprites/${getNumber(name)}.png`
}

export type Mutation<objType> = (o:objType)=>void

export function applyMutation<objType>(mutate:Mutation<objType>){
    return (obj: objType) => {
        const copy = cloneDeep(obj);
        mutate(copy);
        return copy;
    }
}
