"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const schemaValidarUsuario = config_1.default.object().shape({
    email: config_1.default.string().required().email(),
    senha: config_1.default.string().required().min(8),
});
exports.default = schemaValidarUsuario;
