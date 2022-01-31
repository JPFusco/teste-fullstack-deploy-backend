"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const schemaCadastrarVeiculo = config_1.default.object().shape({
    veiculo: config_1.default.string().required(),
    marca: config_1.default.string().required(),
    ano: config_1.default.number().required(),
    descricao: config_1.default.string().required(),
    vendido: config_1.default.bool().required(),
});
exports.default = schemaCadastrarVeiculo;
