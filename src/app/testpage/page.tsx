
'use client'

import { closestPokemonName } from "@/lib/game_insights"
import { getMoveset } from "@/lib/pokedex";
import { applyMutation, getSpriteDir, import_team } from "@/lib/utils";
import { Open_Sans } from 'next/font/google';
const open_sans = Open_Sans({subsets:['latin']});
import React from "react";
import { useReducer } from "react";
import { Pokemon } from "@ajhyndman/smogon-calc";


const rawTeam = `
Dragalge @ Choice Specs  
Ability: Adaptability  
Tera Type: Fairy  
EVs: 56 HP / 4 Def / 252 SpA / 4 SpD / 192 Spe  
Modest Nature  
IVs: 0 Atk  
- Draco Meteor  
- Sludge Bomb  
- Thunderbolt  
- Focus Blast  

Landorus-Therian @ Rocky Helmet  
Ability: Intimidate  
Tera Type: Water  
EVs: 248 HP / 8 Def / 252 Spe  
Jolly Nature  
- Earthquake  
- U-turn  
- Stealth Rock  
- Smack Down  

Azumarill @ Assault Vest  
Ability: Huge Power  
Tera Type: Water  
EVs: 104 HP / 244 Atk / 160 Spe  
Adamant Nature  
- Liquidation  
- Play Rough  
- Aqua Jet  
- Ice Spinner  

Zamazenta @ Leftovers  
Ability: Dauntless Shield  
Tera Type: Fire  
EVs: 248 HP / 8 Def / 252 Spe  
Jolly Nature  
IVs: 0 Atk  
- Body Press  
- Substitute  
- Protect  
- Iron Defense  

Garganacl @ Covert Cloak  
Ability: Purifying Salt  
Tera Type: Water  
EVs: 248 HP / 4 Atk / 16 Def / 228 SpD / 12 Spe  
Impish Nature  
- Salt Cure  
- Earthquake  
- Curse  
- Recover  

Drifblim @ Heavy-Duty Boots  
Ability: Aftermath  
Tera Type: Ghost  
EVs: 136 HP / 252 Def / 24 SpA / 4 SpD / 92 Spe  
Bold Nature  
IVs: 0 Atk  
- Will-O-Wisp  
- Defog  
- Strength Sap  
- Shadow Ball  
`;

const enemy_team_raw_names = `
    masquerain
    aramrouge
    gholdengo
    ironhands
    rillaboom
    ironvalitan
`.trim().split('\n').map(x=>x.trim());
const enemy_team_names = enemy_team_raw_names.map(closestPokemonName);



type PageAction = {
    type: 'Typing-EnemyPokemonBox',
    value: string
} | {
    type: 'Submit-EnemyPokemonBox',
} | {
    type: 'Click-PokemonBox',
    side: 'ally' | 'enemy'
    value: string
} | {
    type: 'Typing-RawTeamBox',
    value: string
} | {
    type: 'Submit-RawTeam',
};

const reducer = (state: PageState, action: PageAction) => {
    console.log(action.type);
    const mutation = (S: PageState) => {
        switch(action.type) {
            case 'Typing-EnemyPokemonBox':
                S.enemyTeamEntryBox = action.value;
                break;
            case 'Submit-EnemyPokemonBox':
                if(S.enemyTeamEntryBox !== '' && S.enemyTeamNames.length < 6){
                    const pokemonToAdd = closestPokemonName(S.enemyTeamEntryBox);
                    if (!(S.enemyTeamNames.includes(pokemonToAdd))){
                        S.enemyTeamNames.push(pokemonToAdd);
                    }
                }
                S.enemyTeamEntryBox = '';
                break;
            case 'Typing-RawTeamBox':
                S.rawTeam = action.value;
                break;
            case 'Submit-RawTeam':
                S.processedTeam = import_team(S.rawTeam);
                break;
            case 'Click-PokemonBox':
                
            default:
                throw Error('Unknown action: ' + action.type);
        }
    }
    return applyMutation(mutation)(state)
};


type PageState = {
    rawTeam: string,
    processedTeam?: Pokemon[],
    enemyTeamNames: string[]
    stage: number,
    enemyTeamEntryBox: string,
    selectedAllyMon?: string,
    selectedEnemyMon?: string,
}

const initialState = {
    rawTeam,
    enemyTeamNames:[],
    enemyTeamEntryBox: '',
    stage: 1,
}

export default function page() {

    const [S, dispatch] = useReducer(reducer, initialState);

    const teamEntryBox = (
        <div>
            {S.processedTeam ? 
                <div className="flex">
                    {S.processedTeam.map((pokemon) =>
                        <div className="hover:bg-slate-500 p-4" key={pokemon.name} onClick={e=>{
                            e.preventDefault();
                            dispatch({type: 'Click-PokemonBox', side: 'ally', value: pokemon.name})
                        }}>
                            <img src={getSpriteDir(pokemon.name)} />
                            <div>{pokemon.name}</div>
                        </div>
                    )}
                </div>
            :
                <div className="flex flex-col">
                    <textarea
                        className="whitespace-pre text-white w-1/3 h-80 bg-slate-700"
                        onChange={e=>{
                            e.preventDefault();
                            dispatch({type: 'Typing-RawTeamBox', value:e.target.value});
                        }}
                        value={S.rawTeam}
                    />
                    <div className="pt-4"></div>
                    <div>
                        <button className=
                            "border border-slate-500 bg-teal-500 rounded hover:bg-teal-800 hover:text py-2 px-4"
                            onClick={e=>dispatch({type:'Submit-RawTeam'})}>
                            Submit Team
                        </button>
                    </div>
                    
                </div>
            }
        </div>
    )

    const enemyEntryBox = (
        <div className="flex">
            <div>
                <input
                    className="text-black m-4"
                    onChange={e=>{
                        e.preventDefault();
                        dispatch({type: 'Typing-EnemyPokemonBox', value:e.target.value})
                    }}
                    value={S.enemyTeamEntryBox}
                    onKeyDown={e=>{
                        if(e.key === 'Enter'){
                            dispatch({type: 'Submit-EnemyPokemonBox'})
                        }
                    }}
                />
            </div>
            <div className="flex">
                {S.enemyTeamNames.map((enemyName)=>
                    <div className="text-white hover:bg-slate-500 p-4" key={enemyName}>
                        <img src={getSpriteDir(enemyName)} />
                        <div>{enemyName}</div>
                    </div>
                )}
            </div>
        </div>
    )

    const movesetDisplay = (
        <div className="text-gray-300 font-sm text-sm grid grid-rows-[repeat(5,min-content)] grid-flow-col gap-3">
            {S.enemyTeamNames.map((name)=>{
                const {abilities, items, moves, spreads} = getMoveset(name);
                return <React.Fragment key={name}>
                    <img src={getSpriteDir(name)} />
                    <div>{abilities.map(x=>
                        <div key={name + x.name}>{x.name}: {Math.trunc(x.usage * 100)}%</div>
                    )}</div>
                    <div>{items.map(x=>
                        <div key={name + x.name}>{x.name}: {Math.trunc(x.usage * 100)}%</div>
                    )}</div>
                    <div>{moves.map(x=>
                        <div key={name + x.name}>{x.name}: {Math.trunc(x.usage * 100)}%</div>
                    )}</div>
                    <div>{spreads.map(x=>
                        <div key={name + x}>{x}</div>
                    )}</div>
                </ React.Fragment>;
            })}
        </div>
    )

    const battlefield = (
        <div className="">
            <div className="w-full flex justify-evenly align-center">
                <div className="">
                    ALLY MON
                    <img src={getSpriteDir(closestPokemonName('garchomp'))} />
                </div>
                <div className="">
                    ENEMY MON
                    <img src={getSpriteDir(closestPokemonName('enamrous'))} />
                </div>
            </div>
        </div>
    )

    return (
        <div className={"min-h-screen bg-teal-950 flex justify-center"}>
            <div className="max-w-screen-lg w-full">
                <div className={open_sans.className}>
                    
                    {enemyEntryBox}
                    <div className="pt-4"></div>
                    {battlefield}
                    <div className="pt-4"></div>
                    {teamEntryBox}
                    <div className="pt-4"></div>
                    {movesetDisplay}
                    
                </div>
            </div>
        </div>
    )
}



             