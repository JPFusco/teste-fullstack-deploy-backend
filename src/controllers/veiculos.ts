import { Request, Response } from 'express';
import knexInstance from '../connection';
import IVeiculo from '../interfaces/veiculo';
import schemaCadastrarVeiculo from '../schema/veiculos/schemaCadastrarVeiculo';
import schemaAtualizarVeiculo from '../schema/veiculos/schemaAtualizarVeiculo';

interface IErr {
  ok: boolean,
  message: string
}

const encontrarVeiculoDB = async (idVeiculo: string, idUsuario: string) => {
  const veiculo = await knexInstance<IVeiculo>('veiculos')
    .where({ id: idVeiculo })
    .select('*')
    .first();
  const err: Partial<IErr> = { ok: true };

  if (!veiculo) {
    err.ok = false;
    err.message = `Não foi possível encontrar o veículo de id ${idVeiculo}`;
  } else if (String(veiculo.usuario_id) !== idUsuario) {
    err.ok = false;
    err.message = `Você não possui autorização para manipular o veículo de id ${idVeiculo}`;
  }

  return { veiculo, err };
};

const obterVeiculos = async (req: Request, res: Response) => {
  const idUsuario = req.usuario;
  try {
    const veiculos = await knexInstance<IVeiculo>('veiculos')
      .select('*')
      .where({ usuario_id: idUsuario })
      .orderBy('id');

    if (!veiculos) {
      return res.status(400).json({ message: 'Não foi possível encontrar um veículo' });
    }

    return res.status(200).json(veiculos);
  } catch (error: any) {
    return res.status(400).json(error.message);
  }
};

const obterVeiculo = async (req: Request, res: Response) => {
  const { id: idVeiculo } = req.params;
  const idUsuario = req.usuario;

  try {
    const { veiculo, err } = await encontrarVeiculoDB(idVeiculo, idUsuario);

    if (!err.ok) {
      return res.status(400).json({ message: err.message });
    }

    return res.status(200).json(veiculo);
  } catch (error: any) {
    return res.status(400).json(error.message);
  }
};

const cadastrarVeiculo = async (req: Request, res: Response) => {
  const {
    veiculo, marca, ano, descricao, vendido,
  } = req.body;
  const idUsuario = req.usuario;

  try {
    await schemaCadastrarVeiculo.validate(req.body);

    const veiculoCadastrado = await knexInstance<IVeiculo>('veiculos').insert({
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
  } catch (error: any) {
    return res.status(400).json(error.message);
  }
};

const atualizarVeiculoCompleto = async (req: Request, res: Response) => {
  const {
    veiculo, marca, ano, descricao, vendido,
  } = req.body;
  const { id: idVeiculo } = req.params;
  const idUsuario = req.usuario;

  try {
    await schemaCadastrarVeiculo.validate(req.body);

    const { err } = await encontrarVeiculoDB(idVeiculo, idUsuario);

    if (!err.ok) {
      return res.status(400).json({ message: err.message });
    }

    const veiculoAtualizado = await knexInstance<IVeiculo>('veiculos').where({ id: idVeiculo }).update({
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
  } catch (error: any) {
    return res.status(400).json(error.message);
  }
};

const atualizarVeiculoParcial = async (req: Request, res: Response) => {
  const {
    veiculo, marca, ano, descricao, vendido,
  } = req.body;
  const { id: idVeiculo } = req.params;
  const idUsuario = req.usuario;

  try {
    await schemaAtualizarVeiculo.validate(req.body);

    const { err } = await encontrarVeiculoDB(idVeiculo, idUsuario);

    if (!err.ok) {
      return res.status(400).json({ message: err.message });
    }

    const body: Partial<IVeiculo> = {};

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

    const veiculoAtualizado = await knexInstance<IVeiculo>('veiculos')
      .where('id', idVeiculo)
      .update({ ...body, updated: new Date() })
      .returning('*');

    if (!veiculoAtualizado) {
      return res.status(400).json({ message: `Não foi possível atualizar o veículo de id ${idVeiculo}` });
    }

    return res.status(200).json('Veículo atualizado com sucesso');
  } catch (error: any) {
    return res.status(400).json(error.message);
  }
};

const excluirVeiculo = async (req: Request, res: Response) => {
  const { id: idVeiculo } = req.params;
  const idUsuario = req.usuario;

  try {
    const { err } = await encontrarVeiculoDB(idVeiculo, idUsuario);

    if (!err.ok) {
      return res.status(400).json({ message: err.message });
    }

    const veiculoExcluido = await knexInstance<IVeiculo>('veiculos').where({ id: idVeiculo }).del().returning('*');

    if (!veiculoExcluido) {
      return res.status(400).json({ message: 'Não foi possível excluir o veículo' });
    }

    return res.status(200).json('Veículo excluído com sucesso');
  } catch (error: any) {
    return res.status(400).json(error.message);
  }
};

export default {
  obterVeiculos,
  obterVeiculo,
  cadastrarVeiculo,
  atualizarVeiculoCompleto,
  atualizarVeiculoParcial,
  excluirVeiculo,
};
