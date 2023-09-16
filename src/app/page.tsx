
'use client'

import { Open_Sans } from 'next/font/google';
const open_sans = Open_Sans({subsets:['latin']});
import React, { useReducer } from "react";

import { reducer } from './action';
import { PageState, derivePageContent, evSpreads } from './state';


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

const initialState: PageState = {
    allyTeam: {
        status: 'not submitted',
        textBox: rawTeam,
    },
    enemyTeam: {
        textBox: '',
        names: [],
    }
}

export default function page() {

    const [underlyingState, dispatch] = useReducer(reducer, initialState);
    const content = derivePageContent(underlyingState);

    const teamEntryBox = (
        <div>
            {content.allyContent.type === 'text box' ?
                <div className="flex flex-col">
                    <textarea
                        className="whitespace-pre text-white w-1/3 h-80 bg-slate-700"
                        onChange={e=>{
                            e.preventDefault();
                            dispatch({type: 'Typing-RawTeamBox', value: e.target.value});
                        }}
                        value={content.allyContent.textBox}
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
            : 
                <div className="flex">
                    {content.allyContent.iconData.map((iconDatum, i) =>
                        <div
                            className={"hover:bg-slate-500 p-4 cursor-pointer flex flex-col" + ' ' + iconDatum.additionalTailwindClasses}
                            key={iconDatum.name}
                            onClick={e=>{
                                e.preventDefault();
                                dispatch({type: 'Click-PokemonBox', side: 'ally', value: i})
                            }}>
                            <img src={iconDatum.spriteDir} className="w-28 h-28 block mx-auto" />
                            <div className="text-center">{iconDatum.name}</div>
                        </div>
                    )}
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
                    value={content.enemyTeamIcons.textBox}
                    onKeyDown={e=>{
                        if(e.key === 'Enter'){
                            dispatch({type: 'Submit-EnemyPokemonBox'})
                        }
                    }}
                />
            </div>
            <div className="flex">
                {content.enemyTeamIcons.iconData.map((iconDatum, i)=>
                    <div
                        className={"hover:bg-slate-500 p-4 cursor-pointer flex flex-col" + ' ' + iconDatum.additionalTailwindClasses}
                        key={iconDatum.name}
                        onClick={e=>{
                            e.preventDefault();
                            dispatch({type: 'Click-PokemonBox', side: 'enemy', value: i})
                        }}>
                        <img src={iconDatum.spriteDir} className="w-28 h-28 block mx-auto" />
                        <div className="text-center">{iconDatum.name}</div>
                    </div>
                )}
            </div>
        </div>
    )

    const matchupArea = (
        <div>
            <div className="w-full flex justify-evenly align-center">
                <div className="">
                    <div className="text-center">{content.matchupArea.ally.name}</div>
                    <img src={content.matchupArea.ally.spriteDir} className="w-28 h-28 block mx-auto" />
                    <div className='flex flex-col gap-4'>
                        {
                            content.matchupArea.ally.calcs !== undefined
                        ?
                            content.matchupArea.ally.calcs.map((calcGroup, i)=><div key={i}>
                                {Object.keys(evSpreads)[i]}
                                {calcGroup.map(calc=><div
                                    className='border border-slate-500 flex justify-between gap-4 text-black'
                                    key={calc.moveName}
                                    style={{backgroundColor: calc.color}}
                                >
                                    <div className=''>{calc.moveName}</div>
                                    <div className=''>{calc.minDmg}-{calc.maxDmg}</div>
                                </div>)
                            }</div>)
                        :
                            <div>
                                select two pokemon to see calcs
                            </div>
                        }
                    </div>
                </div>
                
                <div className="">
                    <div className="text-center">{content.matchupArea.enemy.name}</div>
                    <img src={content.matchupArea.enemy.spriteDir} className="w-28 h-28 block mx-auto" />
                    { content.matchupArea.enemy.moveset !== undefined ?
                        <div className="flex">
                            <div>
                                <div className="font-bold">Moves</div>
                                <div className="pt-2"></div>
                                {content.matchupArea.enemy.moveset.moves.map(move=>
                                    <div key={move.name}>{move.name}: {move.usage}%</div>
                                )}
                            </div>

                            <div className="pl-8"></div>

                            <div>
                                <div>
                                    <div className="font-bold">Abilities</div>
                                    <div className="pt-2"></div>
                                    {content.matchupArea.enemy.moveset.abilities.map(ability=>
                                        <div key={ability.name}>{ability.name}: {ability.usage}%</div>
                                    )}
                                </div>
                                <div className="pt-8"></div>
                                <div>
                                    <div className="font-bold">Items</div>
                                    <div className="pt-2"></div>
                                    {content.matchupArea.enemy.moveset.items.map(item=>
                                        <div key={item.name}>{item.name}: {item.usage}%</div>
                                    )}
                                </div>
                                <div className="pt-8"></div>
                                <div>
                                    <div className="font-bold">Spreads</div>
                                    <div className="pt-2"></div>
                                    {content.matchupArea.enemy.moveset.spreads.map(spread=>
                                        <div key={spread}>{spread}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    : <></>}
                </div>
            </div>
        </div>
    )


    return (
        <div className={"min-h-screen bg-teal-950 flex justify-center"}>
            <div className="max-w-screen-lg w-full">
                <div className={open_sans.className}>
                    <div className="pt-12"></div>
                    {enemyEntryBox}
                    <div className="pt-12"></div>
                    {matchupArea}
                    <div className="pt-12"></div>
                    {teamEntryBox}
                    <div className="pt-12"></div>
                </div>
            </div>
        </div>
    )
}