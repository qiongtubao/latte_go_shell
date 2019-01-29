import * as child_process from "child_process";
import * as latte_run_shell from "latte_run_shell"
import * as fs from "fs"
import * as shellJs from 'shelljs';
import * as Path from 'path'
import { async } from "latte_lib"

function mkdirSync(path, options?) {
  if(fs.existsSync(path)) {
    return null;
  }
  if(!fs.existsSync(Path.dirname(path))) {
    var error = mkdirSync(Path.dirname(path), options);
    if(error) { return error; }
  }
  return fs.mkdirSync(path, options);
}
export let build = function (url, options, callback) {
  let goPath
  let arrays = [(cb) => {
    shellJs.exec(`export GOPATH=$GOPATH:${options.goPath};go build ${url} `, (err, data) => {
      cb()
    })
  }];
  async.series(arrays, (err, data) => {
    // callback(err, data)
    if (err) {
      return shellJs.exec(`export GOPATH=${goPath}`, () => {
        callback(err)
      })

    }
    shellJs.exec(`export GOPATH=${data[0]}`, () => {
      callback(err, data)
    })
  })
}

export let test = function (testDir: string[], options, callback) {
  let goPath
  let arrays = testDir.map(data => {
    return (cb) => {
      shellJs.exec(`export GOPATH=$GOPATH:${options.goPath};cd ./${data} && go test -v`, (err, data) => {
        cb()
      })
    }
  });
  arrays.unshift((cb) => {
    shellJs.exec(`export GOPATH=$GOPATH:${options.goPath}; go test -v`, (err, data) => {
      cb()
    })
  })
  async.series(arrays, (err, data) => {
    // callback(err, data)
    if (err) {
      return shellJs.exec(`export GOPATH=${goPath}`, () => {
        callback(err)
      })

    }
    shellJs.exec(`export GOPATH=${data[0]}`, () => {
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
    if (err) {
      return shellJs.exec(`export GOPATH=${goPath}`, () => {
        callback(err)
      })

    }
    shellJs.exec(`export GOPATH=${data[0]}`, () => {
      callback(err, data)
    })
  })
}
export function readGoConfig(dirname): any {
  //const dirname = process.cwd()
  let configData
  try {
    configData = fs.readFileSync(dirname + '/package.json').toString()
  } catch (err) {
    //console.error("not find package.json", err)
    return
  }

  let config
  try {
    config = JSON.parse(configData)
  } catch (err) {
    console.error(dirname + '/package.json' + "ERROR")
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
  Object.keys(data).map((key) => {
    arrays.push((cb) => {
      let ps = data[key].split('/');
      let filename = ps.pop()
      let dirPath = ps.join('/')
      console.log(`${process.cwd()}/src/${dirPath}`)
      let error = mkdirSync(`${process.cwd()}/src/${dirPath}`)
      if(error) {
        return cb(error)
      }
      child_process.exec(`sh ${__dirname}/../../shell/goInstall2.sh ${goRoot.trim()}  ${dirPath} ${filename}`, {
        env: {
          'GOPATH': options.goPath,
        }
      }, (err, stdout, stderr) => {
        if (err) {
          //return cb(err)
          console.log('??????????',err)
          // if(data[key].indexOf('github.com/') == 0) {
          //   return child_process.exec(`sh ${__dirname}/../../shell/goInstall.sh ${goRoot.trim()} ${data[key]}`, {
          //     env: {
          //       'GOPATH': options.goPath
          //     }
          //   }, (err, stdout, stderr) => {
          //     return cb(err)
          //   })
          // }else{
          //   return cb(err)
          // }
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