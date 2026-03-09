import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const listar = async (req: Request, res: Response) => {
  try {
    const lojaId = (req as any).lojaId;
    const produtos = await prisma.produto.findMany({
      where: { lojaId },
      include: { estoques: true },
    });
    return res.json(produtos);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno do servidor!' });
  }
};

export const buscarPorCodigo = async (req: Request, res: Response) => {
  try {
    const codigo = String(req.params.codigo);
    const produto = await prisma.produto.findUnique({
      where: { codigo },
      include: { estoques: true },
    });
    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado!' });
    }
    return res.json(produto);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno do servidor!' });
  }
};

export const cadastrar = async (req: Request, res: Response) => {
  try {
    const lojaId = (req as any).lojaId;
    const { codigo, nome, categoria, descricao, fotoUrl } = req.body;

    if (!codigo || !nome || !categoria || !fotoUrl) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando!' });
    }

    const jaExiste = await prisma.produto.findUnique({
      where: { codigo: String(codigo) },
    });

    if (jaExiste) {
      return res.status(400).json({ erro: 'Código de produto já cadastrado!' });
    }

    const produto = await prisma.produto.create({
      data: { codigo, nome, categoria, descricao, fotoUrl, lojaId },
    });

    return res.status(201).json(produto);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno do servidor!' });
  }
};

export const atualizarEstoque = async (req: Request, res: Response) => {
  try {
    const { produtoId, tamanho, cor, quantidade } = req.body;

    if (!produtoId || !tamanho || !cor || quantidade === undefined) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios!' });
    }

    const estoqueExistente = await prisma.estoque.findFirst({
      where: { produtoId, tamanho, cor },
    });

    let estoque;
    if (estoqueExistente) {
      estoque = await prisma.estoque.update({
        where: { id: estoqueExistente.id },
        data: { quantidade },
      });
    } else {
      estoque = await prisma.estoque.create({
        data: { produtoId, tamanho, cor, quantidade },
      });
    }

    return res.json(estoque);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno do servidor!' });
  }
};

export const verificarDisponibilidade = async (req: Request, res: Response) => {
  try {
    const codigo = String(req.params.codigo);
    const tamanho = String(req.params.tamanho);

    const produto = await prisma.produto.findUnique({
      where: { codigo },
    });

    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado!' });
    }

    const estoques = await prisma.estoque.findMany({
      where: { produtoId: produto.id, tamanho },
    });

    const disponivel = estoques.some((e) => e.quantidade > 0);

    return res.json({
      produto: {
        id: produto.id,
        codigo: produto.codigo,
        nome: produto.nome,
        categoria: produto.categoria,
        fotoUrl: produto.fotoUrl,
      },
      tamanho,
      disponivel,
      estoques,
    });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno do servidor!' });
  }
};