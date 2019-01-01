import * as all from "./index"
export function findModule(commond, ...args) {
    return all[commond]
}