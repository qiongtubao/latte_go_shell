"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process = require("child_process");
var fs = require("fs");
var shellJs = require("shelljs");
var Path = require("path");
var latte_lib_1 = require("latte_lib");
function mkdirSync(path, options) {
    if (fs.existsSync(path)) {
        return null;
    }
    if (!fs.existsSync(Path.dirname(path))) {
        var error = mkdirSync(Path.dirname(path), options);
        if (error) {
            return error;
        }
    }
    return fs.mkdirSync(path, options);
}
exports.build = function (url, options, callback) {
    var goPath;
    var arrays = [function (cb) {
            shellJs.exec("export GOPATH=$GOPATH:" + options.goPath + ";go build " + url + " ", function (err, data) {
                cb();
            });
        }];
    latte_lib_1.async.series(arrays, function (err, data) {
        if (err) {
            return shellJs.exec("export GOPATH=" + goPath, function () {
                callback(err);
            });
        }
        shellJs.exec("export GOPATH=" + data[0], function () {
            callback(err, data);
        });
    });
};
exports.test = function (testDir, options, callback) {
    var goPath;
    var arrays = testDir.map(function (data) {
        return function (cb) {
            shellJs.exec("export GOPATH=$GOPATH:" + options.goPath + ";cd ./" + data + " && go test -v", function (err, data) {
                cb();
            });
        };
    });
    arrays.unshift(function (cb) {
        shellJs.exec("export GOPATH=$GOPATH:" + options.goPath + "; go test -v", function (err, data) {
            cb();
        });
    });
    latte_lib_1.async.series(arrays, function (err, data) {
        if (err) {
            return shellJs.exec("export GOPATH=" + goPath, function () {
                callback(err);
            });
        }
        shellJs.exec("export GOPATH=" + data[0], function () {
            callback(err, data);
        });
    });
};
exports.run = function (url, options, callback) {
    var goPath;
    var arrays = [function (cb) {
            shellJs.exec("export GOPATH=$GOPATH:" + options.goPath + ";go run " + url + " " + options.params.join(' '), function (err, data) {
                cb();
            });
        }];
    latte_lib_1.async.series(arrays, function (err, data) {
        if (err) {
            return shellJs.exec("export GOPATH=" + goPath, function () {
                callback(err);
            });
        }
        shellJs.exec("export GOPATH=" + data[0], function () {
            callback(err, data);
        });
    });
};
function readGoConfig(dirname) {
    var configData;
    try {
        configData = fs.readFileSync(dirname + '/package.json').toString();
    }
    catch (err) {
        return;
    }
    var config;
    try {
        config = JSON.parse(configData);
    }
    catch (err) {
        console.error(dirname + '/package.json' + "ERROR");
        return;
    }
    return config;
}
exports.readGoConfig = readGoConfig;
function gets(data, options, callback) {
    var goRoot;
    var arrays = [function (cb) {
            shellJs.exec("echo $GOROOT", function (err, stdout, stderr) {
                goRoot = stdout.trim() + '/bin/go';
                cb(undefined, stdout);
            });
        }];
    Object.keys(data).map(function (key) {
        arrays.push(function (cb) {
            var ps = data[key].split('/');
            var filename = ps.pop();
            var dirPath = ps.join('/');
            console.log(process.cwd() + "/src/" + dirPath);
            var error = mkdirSync(process.cwd() + "/src/" + dirPath);
            if (error) {
                return cb(error);
            }
            child_process.exec("sh " + __dirname + "/../../shell/goInstall2.sh " + goRoot.trim() + "  " + dirPath + " " + filename, {
                env: {
                    'GOPATH': options.goPath,
                }
            }, function (err, stdout, stderr) {
                if (err) {
                    console.log('??????????', err);
                    return cb(err);
                }
                cb();
            });
        });
    });
    latte_lib_1.async.series(arrays, function (err, data) {
        callback();
    });
}
exports.gets = gets;
