
import * as Path from "path"
import { readFileSync } from "fs";
import * as command from "../command"
import * as latte_lib from "latte_lib"
export default function handle(...args) {
    gets(process.cwd(), function(error, result) {
        if(!result) {
            return console.log('not find package.json')
        }
        //console.log("结束",error, result)
    })

}
function gets(dirname, callback) {
    let config = command.readGoConfig(dirname)
    if(!config) {
        return callback(undefined, false)
    }
    command.gets(config.devDependencies, {
        goPath: process.cwd()
    }, (err, data) => {
        let lists = Object.keys(config.devDependencies).map((key) => {
            return function(cb) {
                gets(process.cwd() + '/src/' + config.devDependencies[key], callback)
            }
        })
        latte_lib.async.series(lists, function() {
            callback(undefined, true)
        })
    })
}