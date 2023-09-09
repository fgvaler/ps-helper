
import sortBy from 'lodash/sortBy';
import map from 'lodash/map';
import { Pokemon } from '@ajhyndman/smogon-calc';
import { LegalPokemon, getUsage, getMoves, pokemonID } from './pokedex';
import { max_damage, gen, min_damage } from './utils';

const NUMBER_OF_THREATS_TO_RETRIEVE = 5;
const RELEVANCE_USAGE_THRESHOLD = 0.01;

export const get_weaknesses = (team: Pokemon[]) => {

    // remove irrelevant pokemon
    const sortedOU = sortBy(LegalPokemon, [getUsage]);
    const relevantOU = sortedOU.filter(x => getUsage(x) > RELEVANCE_USAGE_THRESHOLD);
    // -----

    console.log(relevantOU)
    
    // get problematic pokemon
    const minDamageToTeamPerOUMon = relevantOU.map(x=>({
        pokemonID: x,
        damage: minDamageToTeam(x, team),
    }));
    const maxDamageFromTeamPerOUMon = relevantOU.map(x=>({
        pokemonID: x,
        damage: maxDamageFromTeam(x, team),
    }));
    // -----

    //get top pokemon from each list
    const offensive_threats = sortBy(minDamageToTeamPerOUMon, 'damage');
    const top_offensive_threats = map(offensive_threats.slice(-NUMBER_OF_THREATS_TO_RETRIEVE),'pokemonID');

    const defensive_threats = sortBy(maxDamageFromTeamPerOUMon, 'damage');
    const top_defensive_threats = map(defensive_threats.slice(-NUMBER_OF_THREATS_TO_RETRIEVE),'pokemonID');
    // -----

    return {
        top_offensive_threats,
        top_defensive_threats,
    };
};

const minDamageToTeam = (attackerID: pokemonID, team: Pokemon[]) => {
    const attacker_moveset = getMoves(attackerID);
    const abilities = map(attacker_moveset['abilities'], 'name').filter(x=>x!=='Other');
    const items = map(attacker_moveset['items'], 'name').filter(x=>x!=='Other');
    const moves = map(attacker_moveset['moves'], 'name').filter(x=>x!=='Other');
    const natures = ['Adamant', 'Modest'];

    let max_attacking_score = 0;
    let best_attacker_so_far;
    for(const ability of abilities){
        for(const item of items){
            for(const nature of natures){
                const attacker = new Pokemon(
                    gen,
                    attackerID,
                    {
                        ability,
                        item,
                        nature,
                        ivs: {hp: 31, atk:31, def:31, spa:31, spd:31, spe:31},
                        evs: {hp: 0, atk:252, def:0, spa:252, spd:0, spe:0},
                        moves: [],
                    }
                )
                
                const attacking_score =
                    Math.min(...
                        team.map(defender=>
                            Math.max(...
                                moves.map(move=>
                                    max_damage(attacker, defender, move)
                                )
                            )
                        )
                    );
                if(attacking_score>max_attacking_score){
                    max_attacking_score = attacking_score;
                    best_attacker_so_far = attacker;
                }
    }}};

    return max_attacking_score;
};

const maxDamageFromTeam = (defenderID: pokemonID, team: Pokemon[]) => {
    const defender_moveset = getMoves(defenderID);
    const abilities = map(defender_moveset['abilities'], 'name').filter(x=>x!=='Other');
    const items = map(defender_moveset['items'], 'name').filter(x=>x!=='Other');
    const natures = ['Calm', 'Bold'];
    const spreads = [
        {hp: 4, atk:0, def:252, spa:0, spd:252, spe:0},
        {hp: 252, atk:0, def:252, spa:0, spd:4, spe:0},
        {hp: 252, atk:0, def:4, spa:0, spd:252, spe:0}
    ]

    let max_defending_score = 0;
    let best_defender_so_far;
    for(const ability of abilities){
        for(const item of items){
            for(const nature of natures){
                for(const spread of spreads){
                    const defender = new Pokemon(
                        gen,
                        defenderID,
                        {
                            ability,
                            item,
                            nature,
                            ivs: {hp: 31, atk:0, def:31, spa:0, spd:31, spe:31},
                            evs: spread,
                            moves: [],
                        }
                    );

                    const defending_score = 1-
                        Math.max(...team.flatMap(attacker=>
                            attacker.moves.map(move=>
                                min_damage(attacker, defender, move)
                            )
                        ));

                    if(defending_score>max_defending_score){
                        max_defending_score = defending_score;
                        best_defender_so_far = defender;
                    }
    }}}};

    return max_defending_score;
};
