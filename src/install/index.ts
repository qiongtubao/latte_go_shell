
import * as Path from "path"
import { readFileSync } from "fs";
import * as command from "../command"
import * as latte_lib from "latte_lib"
export default function handle(...args) {
    let config = command.readGoConfig()
    if(!config) {
        console.error("not find config")
        return 
    }
    command.gets(config.devDependencies, {
        goPath: process.cwd()
    }, (err, data) => {
        console.log("结束",err, data)
    })

}