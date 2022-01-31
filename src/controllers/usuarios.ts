import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import knexInstance from '../connection';
import schemaValidarUsuario from '../schema/usuarios/schemaValidarUsuario';
import IUsuario from '../interfaces/usuario';

const cadastrarUsuario = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    await schemaValidarUsuario.validate(req.body);

    const emailJaCadastrado = await knexInstance<IUsuario>('usuarios').where({ email }).first();

    if (emailJaCadastrado) {
      return res.status(400).json({ message: 'Já existe um usuário cadastrado com esse email' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const usuarioCadastrado = await knexInstance<IUsuario>('usuarios').insert({ email, senha: senhaHash }).returning('*');

    if (!usuarioCadastrado) {
      return res.status(400).json({ message: 'Não foi possível cadastrar o usuário' });
    }

    return res.status(200).json({ message: 'Usuário cadastrado com sucesso' });
  } catch (error: any) {
    return res.status(400).json(error.message);
  }
};

const logarUsuario = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    await schemaValidarUsuario.validate(req.body);

    const usuarioJaCadastrado = await knexInstance<IUsuario>('usuarios').where({ email }).first();

    if (!usuarioJaCadastrado) {
      return res.status(400).json({ message: 'E-mail e/ou senha inválidos' });
    }

    const senhaValida = await bcrypt.compare(senha, usuarioJaCadastrado.senha);

    if (!senhaValida) {
      return res.status(400).json({ message: 'E-mail e/ou senha inválidos' });
    }

    const { senha: senhaHash, ...usuario } = usuarioJaCadastrado;
    const token = jwt.sign(usuario, String(process.env.JWT_SECRET));
    const resposta = {
      usuario,
      token,
    };

    return res.status(200).json(resposta);
  } catch (error: any) {
    return res.status(400).json(error.message);
  }
};

export default {
  cadastrarUsuario,
  logarUsuario,
};
