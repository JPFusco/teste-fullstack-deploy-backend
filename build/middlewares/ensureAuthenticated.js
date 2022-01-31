"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ensureAuthenticated = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(400).json({ message: 'Para acessar esse endpoint é preciso estar logado' });
    }
    const token = authorization.split(' ')[1];
    try {
        const { id: usuarioId } = jsonwebtoken_1.default
            .verify(token, String(process.env.JWT_SECRET));
        req.usuario = String(usuarioId);
        return next();
    }
    catch (error) {
        return res.status(400).json(error.message);
    }
};
exports.default = ensureAuthenticated;
