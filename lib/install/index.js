"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var command = require("../command");
function handle() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var config = command.readGoConfig();
    if (!config) {
        console.error("not find config");
        return;
    }
    command.gets(config.devDependencies, {
        goPath: process.cwd()
    }, function (err, data) {
        console.log("结束", err, data);
    });
}
exports.default = handle;
