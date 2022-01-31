"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const connection_1 = __importDefault(require("../connection"));
const schemaValidarUsuario_1 = __importDefault(require("../schema/usuarios/schemaValidarUsuario"));
const cadastrarUsuario = async (req, res) => {
    const { email, senha } = req.body;
    try {
        await schemaValidarUsuario_1.default.validate(req.body);
        const emailJaCadastrado = await (0, connection_1.default)('usuarios').where({ email }).first();
        if (emailJaCadastrado) {
            return res.status(400).json({ message: 'Já existe um usuário cadastrado com esse email' });
        }
        const senhaHash = await bcrypt_1.default.hash(senha, 10);
        const usuarioCadastrado = await (0, connection_1.default)('usuarios').insert({ email, senha: senhaHash }).returning('*');
        if (!usuarioCadastrado) {
            return res.status(400).json({ message: 'Não foi possível cadastrar o usuário' });
        }
        return res.status(200).json({ message: 'Usuário cadastrado com sucesso' });
    }
    catch (error) {
        return res.status(400).json(error.message);
    }
};
const logarUsuario = async (req, res) => {
    const { email, senha } = req.body;
    try {
        await schemaValidarUsuario_1.default.validate(req.body);
        const usuarioJaCadastrado = await (0, connection_1.default)('usuarios').where({ email }).first();
        if (!usuarioJaCadastrado) {
            return res.status(400).json({ message: 'E-mail e/ou senha inválidos' });
        }
        const senhaValida = await bcrypt_1.default.compare(senha, usuarioJaCadastrado.senha);
        if (!senhaValida) {
            return res.status(400).json({ message: 'E-mail e/ou senha inválidos' });
        }
        const { senha: senhaHash, ...usuario } = usuarioJaCadastrado;
        const token = jsonwebtoken_1.default.sign(usuario, String(process.env.JWT_SECRET));
        const resposta = {
            usuario,
            token,
        };
        return res.status(200).json(resposta);
    }
    catch (error) {
        return res.status(400).json(error.message);
    }
};
exports.default = {
    cadastrarUsuario,
    logarUsuario,
};
