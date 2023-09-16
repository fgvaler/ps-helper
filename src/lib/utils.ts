
import { Generations, Move, Pokemon, calculate } from '@ajhyndman/smogon-calc';
import { Teams } from '@/lib/showdown/sim/teams';
import cloneDeep from 'lodash/cloneDeep'


export const gen = Generations.get(9);

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

export const maxDamage = (attacker: Pokemon, defender: Pokemon, move: string) => {
    return damageRange(attacker, defender, move).max;
}

export const minDamage = (attacker: Pokemon, defender: Pokemon, move: string) => {
    return damageRange(attacker, defender, move).min;
}

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

export const isLetter = (str:string) => {
    return str.length === 1 && str.match(/[a-z]/i);
}

export type Mutation<objType> = (o:objType)=>void

export function applyMutation<objType>(mutate:Mutation<objType>){
    return (obj: objType) => {
        const copy = cloneDeep(obj);
        mutate(copy);
        return copy;
    }
}

export const percentageToColor = (percentage: number)=> {
    var hue = ((1 - percentage) * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
}
