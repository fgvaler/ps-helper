import { closestPokemonName } from "@/lib/game_insights"
import { getMoveset } from "@/lib/pokedex";
import { getSpriteDir } from "@/lib/utils";
import range from "lodash/range";
import { Open_Sans } from 'next/font/google';


const team = `
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

const scuffed_names = `
        masquerain
        aramrouge
        gholdengo
        ironhands
        rillaboom
        ironvalitan
    `.trim().split('\n').map(x=>x.trim());

const open_sans = Open_Sans({
    subsets:['latin'],
});



export default function page() {
    

    const names = scuffed_names.map(closestPokemonName);
    const movesets = names.map(getMoveset);

    return (
    <div className="min-h-screen bg-teal-950 flex justify-center">
        <div className={open_sans.className}>
            <div>
                <div>
                    <div>
                        
                    </div>
                </div>
            </div>
            <div>
                <div className="text-gray-300 font-sm text-sm grid grid-rows-[repeat(5,min-content)] grid-flow-col gap-3">
                    {range(6).map(i=>{
                        const name = names[i];
                        const {abilities, items, moves, spreads} = movesets[i];
                        return <>
                            <img src={getSpriteDir(name)}></img>
                            <div>{abilities.map(x=><div>{x.name}: {Math.trunc(x.usage * 100)}%</div>)}</div>
                            <div>{items.map(x=><div>{x.name}: {Math.trunc(x.usage * 100)}%</div>)}</div>
                            <div>{moves.map(x=><div>{x.name}: {Math.trunc(x.usage * 100)}%</div>)}</div>
                            <div>{spreads.map(x=><div>{x}</div>)}</div>
                        </>;
                    })}
                </div>
            </div>
        </div>
    </div>
    )
}



             