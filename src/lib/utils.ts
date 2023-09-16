
import cloneDeep from 'lodash/cloneDeep'

export const isLetter = (str:string) => {
    return str.length === 1 && str.match(/[a-z]/i);
}

export type Mutation<objType> = (o:objType)=>void

export function applyMutation<objType>(mutate:Mutation<objType>){
    return (obj: objType) => {
        const copy = cloneDeep(obj);
        mutate(copy);
        return copy;
    }
}

export const percentageToColor = (percentage: number)=> {
    var hue = ((1 - percentage) * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
}
