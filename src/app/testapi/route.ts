
import { damageRange, importTeam } from '@/lib/showdown_utils';
import { NextResponse } from 'next/server'


const raw_team = `
Dragalge @ Choice Specs  
Ability: Adaptability  
Tera Type: Fairy  
EVs: 56 HP / 4 Def / 252 SpA / 4 SpD / 192 Spe  
Modest Nature  
IVs: 0 Atk  
- Draco Meteor  
- Ruination  
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
const team = importTeam(raw_team);


export async function GET() {
    const data = damageRange(team[1], team[5], 'stoneedge`');
    return NextResponse.json({ data });
}
