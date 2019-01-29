"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var command = require("../command");
function handle() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var config = command.readGoConfig(process.cwd());
    if (!config) {
        console.error("not find config");
        return;
    }
    var goPath = '';
    var pwd = process.cwd();
    var srcIndex = pwd.indexOf('/src/');
    if (srcIndex != -1) {
        goPath = ':' + pwd.substr(0, srcIndex);
    }
    command.test(config.testDir || [], {
        goPath: pwd + goPath,
        params: args
    }, function (err, data) {
        if (err) {
            console.error("错误:", err);
        }
    });
}
exports.default = handle;
