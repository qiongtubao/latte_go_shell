"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var command = require("../command");
var latte_lib = require("latte_lib");
function handle() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    gets(process.cwd(), function (error, result) {
        if (!result) {
            return console.log('not find package.json');
        }
    });
}
exports.default = handle;
function gets(dirname, callback) {
    var config = command.readGoConfig(dirname);
    if (!config) {
        return callback(undefined, false);
    }
    command.gets(config.devDependencies, {
        goPath: process.cwd()
    }, function (err, data) {
        var lists = Object.keys(config.devDependencies).map(function (key) {
            return function (cb) {
                gets(process.cwd() + '/src/' + config.devDependencies[key], callback);
            };
        });
        latte_lib.async.series(lists, function () {
            callback(undefined, true);
        });
    });
}
