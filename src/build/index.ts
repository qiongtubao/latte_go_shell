
import * as Path from "path"
import * as command from "../command"
import * as latte_lib from "latte_lib"
export default function handle(...args) {
    let config = command.readGoConfig(process.cwd())
    if(!config) {
        console.error("not find config")
        return 
    }
    command.build(config.main, {
        goPath: process.cwd(),
        params: args
    }, (err, data) => {
        if(err) {
            console.error("错误:", err)
        }
        // console.log("结束",err, data)
    })

}
