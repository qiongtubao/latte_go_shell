"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var all = require("./index");
function findModule(commond) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return all[commond];
}
exports.findModule = findModule;
