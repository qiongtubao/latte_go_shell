import * as child_process from "child_process";
import * as latte_run_shell from "latte_run_shell"
import * as fs from "fs"
import { readFileSync } from "fs";
import * as shellJs from 'shelljs';
import { async } from "latte_lib"


export let build = function(url, options, callback) {
  let goPath
  let arrays = [(cb) => {
    shellJs.exec(`export GOPATH=$GOPATH:${options.goPath};go build ${url} `, (err, data) => {
      cb()
    })
  }];
  async.series(arrays, (err, data) => {
    // callback(err, data)
    if(err) {
      return shellJs.exec(`export GOPATH=${goPath}`, () => {
        callback(err)
      }) 
      
    }
    shellJs.exec(`export GOPATH=${data[0]}`, ()=> {
      callback(err, data)
    }) 
  })  
}

export let test = function(url, options, callback) {
  let goPath
  let arrays = [(cb) => {
    shellJs.exec(`export GOPATH=$GOPATH:${options.goPath};go test -v`, (err, data) => {
      cb()
    })
  }];
  async.series(arrays, (err, data) => {
    // callback(err, data)
    if(err) {
      return shellJs.exec(`export GOPATH=${goPath}`, () => {
        callback(err)
      }) 
      
    }
    shellJs.exec(`export GOPATH=${data[0]}`, ()=> {
      callback(err, data)
    }) 
  }) 
}

export let run = function (url, options, callback) {
  let goPath
  let arrays = [(cb) => {
    shellJs.exec(`export GOPATH=$GOPATH:${options.goPath};go run ${url} ${options.params.join(' ')}`, (err, data) => {
      cb()
    })
  }];
  async.series(arrays, (err, data) => {
    // callback(err, data)
    if(err) {
      return shellJs.exec(`export GOPATH=${goPath}`, () => {
        callback(err)
      }) 
      
    }
    shellJs.exec(`export GOPATH=${data[0]}`, ()=> {
      callback(err, data)
    }) 
  })   
}
export function readGoConfig(): any {
  const dirname = process.cwd()
  let configData
  try {
      configData = readFileSync(dirname + '/package.json').toString()
  }catch(err) {
      console.error("not find package.json", err)
      return
  }

  let config
  try {
      config = JSON.parse(configData)
  }catch(err) {
      console.error("package.json ERROR")
      return
  }
  return config
}


export function gets(data, options, callback) {
  var goRoot
  let arrays = [(cb) => {
      shellJs.exec(`echo $GOROOT`, (err, stdout, stderr) => {
        goRoot = stdout.trim() + '/bin/go'
        cb(undefined, stdout)
      })
    }];
  Object.keys(data).map((key)=> {
    arrays.push((cb) => {
        child_process.exec(`sh ${__dirname}/../../shell/goInstall.sh ${goRoot.trim()}  ${data[key]}`, {
          env: {
            'GOPATH': options.goPath
          }
        },(err, stdout, stderr)=> {
          if(err) {
            console.log(err)
            return cb(err)
          }
          cb()
        })
    })
  })
  async.series(arrays, (err, data) => {
    // if(err) {
    //   console.log(err)
    //   return shellJs.exec(`export GOPATH=${goPath}`, () => {
    //     callback(err)
    //   }) 
      
    // }
    // shellJs.exec(`export GOPATH=${data[0]}`, ()=> {
    //   callback(err, data)
    // }) 
    callback()
    
  })
}