
import { getMoveset, getSpriteDir } from "@/lib/pokedex";
import { damageRange, gen, percentageToColor } from "@/lib/utils";
import { Pokemon } from "@ajhyndman/smogon-calc";

export type PageContent = {
    enemyTeamIcons: {
        textBox: string
        iconData: SelectableIcon[],
    },
    matchupArea: {
        ally: {
            name: string,
            spriteDir: string,
            calcs?: MoveDamage[][],
        },
        enemy: {
            name: string,
            spriteDir: string,
            moveset?: {
                items: {
                    name: string,
                    usage: string,
                }[],
                abilities: {
                    name: string,
                    usage: string,
                }[],
                moves: {
                    name: string,
                    usage: string,
                }[],
                spreads: string[],
            },
        },
    },
    allyContent: AllyContent,
};

export type MoveDamage = {
    moveName: string,
    minDmg: string,
    maxDmg: string,
    color: string
}

export type AllyContent = {
    type: 'text box',
    textBox: string,
} | {
    type: 'icons',
    iconData: SelectableIcon[]
};

export type SelectableIcon = {
    name: string,
    spriteDir: string,
    additionalTailwindClasses: string
}


export type PageState = {
    allyTeam: {
        status: 'not submitted',
        textBox: string,
    } | {
        status: 'submitted',
        team: Pokemon[],
        selectedMember?: number
    },
    enemyTeam: {
        textBox: string,
        names: string[],
        selectedMember?: number
    }
}

export const derivePageContent = (s: PageState) => {
    
    const iconData = s.enemyTeam.names.map((name, i)=>{
        let additionalTailwindClasses = ''
        if(s.enemyTeam.selectedMember !== undefined && s.enemyTeam.selectedMember === i){
            additionalTailwindClasses = 'bg-slate-500'
        }
        return {
            name,
            spriteDir: getSpriteDir(name),
            additionalTailwindClasses
        }
    })

    let allyContent: AllyContent
    if(s.allyTeam.status === 'not submitted'){
        allyContent = {
            type: 'text box',
            textBox: s.allyTeam.textBox
        }
    } else {
        const allyTeam = s.allyTeam
        const iconData = s.allyTeam.team.map(mon=>mon.name).map((name, i)=>{
            let additionalTailwindClasses = ''
            if(allyTeam.selectedMember && allyTeam.selectedMember === i){
                additionalTailwindClasses = 'bg-slate-500'
            }
            return {
                name,
                spriteDir: getSpriteDir(name),
                additionalTailwindClasses
            }
        })
        allyContent = {
            type: 'icons',
            iconData
        }
    }

    let content: PageContent = {
        enemyTeamIcons:{
            textBox: s.enemyTeam.textBox,
            iconData
        },
        matchupArea: {
            ally: {
                name: 'Kingambit',
                spriteDir: getSpriteDir('Kingambit'),
            },
            enemy: {
                name: 'Kingambit',
                spriteDir: getSpriteDir('Kingambit'),
            }
        },
        allyContent,
    }

    if(s.allyTeam.status === 'submitted' && s.allyTeam.selectedMember !== undefined){
        const name = s.allyTeam.team[s.allyTeam.selectedMember].name;
        content.matchupArea.ally = {
            name,
            spriteDir: getSpriteDir(name), 
        }
    }
    
    if(s.enemyTeam.selectedMember !== undefined){
        const name = s.enemyTeam.names[s.enemyTeam.selectedMember];
        const {items, abilities, moves, spreads} = getMoveset(name);
        content.matchupArea.enemy = {
            name,
            spriteDir: getSpriteDir(name),
            moveset: {
                items: items.map(item=>({
                    name: item.name,
                    usage: (item.usage*100).toFixed(2).toString()
                })),
                abilities: abilities.map(ability=>({
                    name: ability.name,
                    usage: (ability.usage*100).toFixed(2).toString()
                })),
                moves: moves.map(move=>({
                    name: move.name,
                    usage: (move.usage*100).toFixed(2).toString()
                })),
                spreads: spreads.map(spread=>spread.split(' ')[0]),
            },
        }
    }

    if(s.allyTeam.status === 'submitted' && s.allyTeam.selectedMember !== undefined && s.enemyTeam.selectedMember !== undefined){
        const allyMon = s.allyTeam.team[s.allyTeam.selectedMember]
        const enemyMonName = s.enemyTeam.names[s.enemyTeam.selectedMember]
        content.matchupArea.ally.calcs = Object.keys(evSpreads).map(spreadName=>
            allyMon.moves.map(move=>
                damageCalc(allyMon, enemyMonName, evSpreads[spreadName], move)
            )
        )
    }

    return content;
}

const damageCalc = (allyMon: Pokemon, enemyMonName: string, spread: EvSpread, move: string) => {
    const { abilities } = getMoveset(enemyMonName);
    const defender = new Pokemon(
        gen,
        enemyMonName,
        {
            ability: abilities[0].name,
            ivs: { hp: 31, atk:0, def:31, spa:31, spd:31, spe:31 },
            evs: spread,
            moves: [],
        }
    )

    const result = damageRange(allyMon, defender, move);

    const color = percentageToColor(1-((result.min + result.max)/2))

    return {
        moveName: move,
        minDmg: (result.min*100).toFixed(2).toString(),
        maxDmg: (result.max*100).toFixed(2).toString(),
        color
    }
}

type EvSpread = {
    hp: number;
    atk: number;
    def: number;
    spa: number;
    spd: number;
    spe: number;
}

const evSpreads:{[key: string]: EvSpread} = {
    'Max HP, Max Def/Spd': {hp:252, atk:0, def:252, spa:0, spd:252, spe:0},
    'Max HP, Min Def/Spd': {hp:252, atk:0, def:0, spa:0, spd:0, spe:0},
    'Min HP, Max Def/Spd': {hp:0, atk:0, def:252, spa:0, spd:252, spe:0},
    'Min HP, Min Def/Spd': {hp:0, atk:0, def:0, spa:0, spd:0, spe:0},
}
