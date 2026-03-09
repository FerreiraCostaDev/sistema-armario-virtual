import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';

// Login do Vendedor
export const login = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios!' });
    }

    const vendedor = await prisma.vendedor.findUnique({
      where: { email },
      include: { loja: true },
    });

    if (!vendedor) {
      return res.status(401).json({ erro: 'Credenciais inválidas!' });
    }

    if (!vendedor.ativo) {
      return res.status(401).json({ erro: 'Vendedor inativo!' });
    }

    const senhaCorreta = await bcrypt.compare(senha, vendedor.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Credenciais inválidas!' });
    }

    const token = jwt.sign(
      { id: vendedor.id, lojaId: vendedor.lojaId },
      process.env.JWT_SECRET as string,
      { expiresIn: '8h' }
    );

    return res.json({
      token,
      vendedor: {
        id: vendedor.id,
        nome: vendedor.nome,
        email: vendedor.email,
        loja: vendedor.loja.nome,
      },
    });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno do servidor!' });
  }
};

// Cadastro do Vendedor
export const cadastrar = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha, lojaId } = req.body;

    if (!nome || !email || !senha || !lojaId) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios!' });
    }

    const jaExiste = await prisma.vendedor.findUnique({
      where: { email },
    });

    if (jaExiste) {
      return res.status(400).json({ erro: 'E-mail já cadastrado!' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const vendedor = await prisma.vendedor.create({
      data: {
        nome,
        email,
        senha: senhaCriptografada,
        lojaId,
      },
    });

    return res.status(201).json({
      id: vendedor.id,
      nome: vendedor.nome,
      email: vendedor.email,
    });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno do servidor!' });
  }
};