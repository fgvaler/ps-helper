
import { levenshteinEditDistance } from "levenshtein-edit-distance"
import { LegalPokemon } from "./pokedex"
import sortBy from "lodash/sortBy"

export const closestPokemonName = (scuffed_name: string) => {
    const dist = (p:string)=>levenshteinEditDistance(scuffed_name, p, true)
    const closest = sortBy(LegalPokemon, dist)
    return closest[0];
}
