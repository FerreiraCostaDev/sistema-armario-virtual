import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { gerarProvaVirtual } from '../services/iaService';

export const gerarLook = async (req: Request, res: Response) => {
  try {
    const { sessaoId, clienteId, produtoCodigo, fotoClienteUrl } = req.body;

    if (!sessaoId || !clienteId || !produtoCodigo || !fotoClienteUrl) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios!' });
    }

    const produto = await prisma.produto.findUnique({
      where: { codigo: String(produtoCodigo) },
    });

    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado!' });
    }

    const imagemUrl = await gerarProvaVirtual({
      fotoClienteUrl,
      fotoProdutoUrl: produto.fotoUrl,
    });

    const expiresEm = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const look = await prisma.look.create({
      data: {
        imagemUrl,
        sessaoId: String(sessaoId),
        clienteId: String(clienteId),
        expiresEm,
        itens: {
          create: {
            produtoId: produto.id,
          },
        },
      },
      include: { itens: true },
    });

    return res.json({
      id: look.id,
      imagemUrl: look.imagemUrl,
      criadoEm: look.criadoEm,
      produto: {
        id: produto.id,
        codigo: produto.codigo,
        nome: produto.nome,
      },
    });
  } catch (error: any) {
    console.error('Erro ao gerar look:', error?.message || error);
    return res.status(500).json({ erro: error?.message || 'Erro ao gerar look!' });
  }
};

export const listarLooks = async (req: Request, res: Response) => {
  try {
    const clienteId = String(req.params.clienteId);

    const looks = await prisma.look.findMany({
      where: { clienteId },
      include: {
        itens: {
          include: { produto: true },
        },
      },
      orderBy: { criadoEm: 'desc' },
    });

    return res.json(looks);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno do servidor!' });
  }
};

export const favoritarLook = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const look = await prisma.look.update({
      where: { id },
      data: { favorito: true },
    });

    return res.json(look);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno do servidor!' });
  }
};