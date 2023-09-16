
import { closestPokemonName, importTeam } from "@/lib/showdown_utils";
import { applyMutation } from "@/lib/utils";
import { PageState } from "./state";

export type PageAction = {
    type: 'Typing-EnemyPokemonBox',
    value: string,
} | {
    type: 'Submit-EnemyPokemonBox',
} | {
    type: 'Click-PokemonBox',
    side: 'ally' | 'enemy',
    value: number,
} | {
    type: 'Typing-RawTeamBox',
    value: string,
} | {
    type: 'Submit-RawTeam',
};


export const reducer = (state: PageState, action: PageAction) => {
    console.log(JSON.stringify(action));
    const mutation = (s: PageState) => {
        switch(action.type) {
            case 'Typing-EnemyPokemonBox':
                s.enemyTeam.textBox = action.value;
                break;
            case 'Submit-EnemyPokemonBox':
                if(s.enemyTeam.textBox !== '' && s.enemyTeam.names.length < 6){
                    const pokemonToAdd = closestPokemonName(s.enemyTeam.textBox);
                    if (!(s.enemyTeam.names.includes(pokemonToAdd))){
                        s.enemyTeam.names.push(pokemonToAdd);
                    }
                }
                s.enemyTeam.textBox = '';
                break;
            case 'Typing-RawTeamBox':
                s.allyTeam = {
                    status: 'not submitted',
                    textBox: action.value,
                }
                break;
            case 'Submit-RawTeam':
                if(s.allyTeam.status === 'not submitted'){
                    s.allyTeam = {
                        status: 'submitted',
                        team: importTeam(s.allyTeam.textBox)
                    }
                }
                break;
            case 'Click-PokemonBox':
                if(action.side === 'ally'){
                    if(s.allyTeam.status === 'submitted'){
                        s.allyTeam.selectedMember = action.value;
                    }
                } else {
                    s.enemyTeam.selectedMember = action.value;
                }
                break;
            default:
                throw Error('Unknown action: ' + JSON.stringify(action));
        }
    }
    return applyMutation(mutation)(state)
};
