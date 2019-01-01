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
    command.run(config.main, {
        goPath: process.cwd()
    }, function (err, data) {
        if (err) {
            console.error("错误:", err);
        }
    });
}
exports.default = handle;
