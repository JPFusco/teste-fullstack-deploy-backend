"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../connection"));
const schemaCadastrarVeiculo_1 = __importDefault(require("../schema/veiculos/schemaCadastrarVeiculo"));
const schemaAtualizarVeiculo_1 = __importDefault(require("../schema/veiculos/schemaAtualizarVeiculo"));
const encontrarVeiculoDB = async (idVeiculo, idUsuario) => {
    const veiculo = await (0, connection_1.default)('veiculos')
        .where({ id: idVeiculo })
        .select('*')
        .first();
    const err = { ok: true };
    if (!veiculo) {
        err.ok = false;
        err.message = `Não foi possível encontrar o veículo de id ${idVeiculo}`;
    }
    else if (String(veiculo.usuario_id) !== idUsuario) {
        err.ok = false;
        err.message = `Você não possui autorização para manipular o veículo de id ${idVeiculo}`;
    }
    return { veiculo, err };
};
const obterVeiculos = async (req, res) => {
    const idUsuario = req.usuario;
    try {
        const veiculos = await (0, connection_1.default)('veiculos')
            .select('*')
            .where({ usuario_id: idUsuario })
            .orderBy('id');
        if (!veiculos) {
            return res.status(400).json({ message: 'Não foi possível encontrar um veículo' });
        }
        return res.status(200).json(veiculos);
    }
    catch (error) {
        return res.status(400).json(error.message);
    }
};
const obterVeiculo = async (req, res) => {
    const { id: idVeiculo } = req.params;
    const idUsuario = req.usuario;
    try {
        const { veiculo, err } = await encontrarVeiculoDB(idVeiculo, idUsuario);
        if (!err.ok) {
            return res.status(400).json({ message: err.message });
        }
        return res.status(200).json(veiculo);
    }
    catch (error) {
        return res.status(400).json(error.message);
    }
};
const cadastrarVeiculo = async (req, res) => {
    const { veiculo, marca, ano, descricao, vendido, } = req.body;
    const idUsuario = req.usuario;
    try {
        await schemaCadastrarVeiculo_1.default.validate(req.body);
        const veiculoCadastrado = await (0, connection_1.default)('veiculos').insert({
            usuario_id: idUsuario,
            veiculo,
            marca,
            ano,
            descricao,
            vendido,
        }).returning('*');
        if (!veiculoCadastrado) {
            return res.status(400).json({ message: 'Não foi possível cadastrar o veículo' });
        }
        return res.status(200).json('Veículo cadastrado com sucesso');
    }
    catch (error) {
        return res.status(400).json(error.message);
    }
};
const atualizarVeiculoCompleto = async (req, res) => {
    const { veiculo, marca, ano, descricao, vendido, } = req.body;
    const { id: idVeiculo } = req.params;
    const idUsuario = req.usuario;
    try {
        await schemaCadastrarVeiculo_1.default.validate(req.body);
        const { err } = await encontrarVeiculoDB(idVeiculo, idUsuario);
        if (!err.ok) {
            return res.status(400).json({ message: err.message });
        }
        const veiculoAtualizado = await (0, connection_1.default)('veiculos').where({ id: idVeiculo }).update({
            veiculo,
            marca,
            ano,
            descricao,
            vendido,
            updated: new Date(),
        }).returning('*');
        if (!veiculoAtualizado) {
            return res.status(400).json({ message: `Não foi possível atualizar o veículo de id ${idVeiculo}` });
        }
        return res.status(200).json('Veículo atualizado com sucesso');
    }
    catch (error) {
        return res.status(400).json(error.message);
    }
};
const atualizarVeiculoParcial = async (req, res) => {
    const { veiculo, marca, ano, descricao, vendido, } = req.body;
    const { id: idVeiculo } = req.params;
    const idUsuario = req.usuario;
    try {
        await schemaAtualizarVeiculo_1.default.validate(req.body);
        const { err } = await encontrarVeiculoDB(idVeiculo, idUsuario);
        if (!err.ok) {
            return res.status(400).json({ message: err.message });
        }
        const body = {};
        if (veiculo) {
            body.veiculo = veiculo;
        }
        if (marca) {
            body.marca = marca;
        }
        if (ano) {
            body.ano = ano;
        }
        if (descricao) {
            body.descricao = descricao;
        }
        if (vendido !== undefined) {
            body.vendido = vendido;
        }
        const veiculoAtualizado = await (0, connection_1.default)('veiculos')
            .where('id', idVeiculo)
            .update({ ...body, updated: new Date() })
            .returning('*');
        if (!veiculoAtualizado) {
            return res.status(400).json({ message: `Não foi possível atualizar o veículo de id ${idVeiculo}` });
        }
        return res.status(200).json('Veículo atualizado com sucesso');
    }
    catch (error) {
        return res.status(400).json(error.message);
    }
};
const excluirVeiculo = async (req, res) => {
    const { id: idVeiculo } = req.params;
    const idUsuario = req.usuario;
    try {
        const { err } = await encontrarVeiculoDB(idVeiculo, idUsuario);
        if (!err.ok) {
            return res.status(400).json({ message: err.message });
        }
        const veiculoExcluido = await (0, connection_1.default)('veiculos').where({ id: idVeiculo }).del().returning('*');
        if (!veiculoExcluido) {
            return res.status(400).json({ message: 'Não foi possível excluir o veículo' });
        }
        return res.status(200).json('Veículo excluído com sucesso');
    }
    catch (error) {
        return res.status(400).json(error.message);
    }
};
exports.default = {
    obterVeiculos,
    obterVeiculo,
    cadastrarVeiculo,
    atualizarVeiculoCompleto,
    atualizarVeiculoParcial,
    excluirVeiculo,
};
