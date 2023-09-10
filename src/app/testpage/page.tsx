import { closestPokemonName } from "@/lib/game_insights"
import { getMoveset } from "@/lib/pokedex";
import { getSpriteDir } from "@/lib/utils";
import range from "lodash/range";
import { Open_Sans } from 'next/font/google'

const open_sans = Open_Sans({
    subsets:['latin'],
})

export default function page() {
    const scuffed_names = `
        masquerain
        aramrouge
        gholdengo
        ironhands
        ironmoth
        ironvalitan
    `.trim().split('\n').map(x=>x.trim())

    const names = scuffed_names.map(closestPokemonName);
    const movesets = names.map(getMoveset);

    return (
    <div className="min-h-screen bg-teal-950 flex justify-center">
        <div className={open_sans.className}>
            <div className="">
                <div className="text-gray-300 font-sm text-sm grid grid-rows-[repeat(5,min-content)] grid-flow-col gap-3">
                    {range(6).map(i=>{
                        const name = names[i];
                        const {abilities, items, moves, spreads} = movesets[i]
                        return <>
                            <img src={getSpriteDir(name)}></img>
                            <div>{abilities.map(x=><div>{x.name}: {Math.trunc(x.usage * 100)}%</div>)}</div>
                            <div>{items.map(x=><div>{x.name}: {Math.trunc(x.usage * 100)}%</div>)}</div>
                            <div>{moves.map(x=><div>{x.name}: {Math.trunc(x.usage * 100)}%</div>)}</div>
                            <div>{spreads.map(x=><div>{x}</div>)}</div>
                        </> 
                    })}
                </div>
            </div>
        </div>
    </div>
    )
}



             