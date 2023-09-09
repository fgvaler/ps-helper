
import { Generations, Move, Pokemon, calculate } from '@ajhyndman/smogon-calc';
import { Teams } from '@/lib/showdown/sim/teams';

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
    
    let result
    try {
        result = calculate(
            gen,
            attacker,
            defender,
            new Move(gen, move)
        );
    } catch (error) {
        throw error;
    }

    let raw_damage: number = 0
	if (typeof(result.damage) === 'number'){
		raw_damage = result.damage
	} else {
		raw_damage = result.damage[result.damage.length - 1] as number
	}
	const damage_perc = raw_damage/defender.stats.hp
	if (damage_perc > 1){
		return 1
	} else {
		return damage_perc
	}
}

export const min_damage = (attacker: Pokemon, defender: Pokemon, move: string) => {
    let result
    try {
        result = calculate(
            gen,
            attacker,
            defender,
            new Move(gen, move)
        );
    } catch (error) {
        throw error;
    }

    let raw_damage: number = 0
	if (typeof(result.damage) === 'number'){
		raw_damage = result.damage
	} else {
		raw_damage = result.damage[0] as number
	}
	const damage_perc = raw_damage/defender.stats.hp
	if (damage_perc > 1){
		return 1
	} else {
		return damage_perc
	}
}
