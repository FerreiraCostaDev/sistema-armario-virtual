import { Request, Response } from 'express';
import prisma from '../config/prisma';

// Verificar se cliente existe pelo telefone
export const verificarTelefone = async (req: Request, res: Response) => {
  try {
    const { telefone } = req.body;

    if (!telefone) {
      return res.status(400).json({ erro: 'Telefone é obrigatório!' });
    }

    const cliente = await prisma.cliente.findUnique({
      where: { telefone },
      include: { medidas: true },
    });

    if (cliente) {
      return res.json({
        existe: true,
        cliente: {
          id: cliente.id,
          nome: cliente.nome,
          telefone: cliente.telefone,
          aceitouLGPD: cliente.aceitouLGPD,
          medidas: cliente.medidas,
        },
      });
    }

    return res.json({ existe: false });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno do servidor!' });
  }
};

// Cadastrar novo cliente
export const cadastrar = async (req: Request, res: Response) => {
  try {
    const { nome, telefone, aceitouLGPD } = req.body;

    if (!telefone) {
      return res.status(400).json({ erro: 'Telefone é obrigatório!' });
    }

    if (!aceitouLGPD) {
      return res.status(400).json({ erro: 'É necessário aceitar os termos LGPD!' });
    }

    const jaExiste = await prisma.cliente.findUnique({
      where: { telefone },
    });

    if (jaExiste) {
      return res.status(400).json({ erro: 'Telefone já cadastrado!' });
    }

    const cliente = await prisma.cliente.create({
      data: {
        nome,
        telefone,
        aceitouLGPD: true,
        dataAceiteLGPD: new Date(),
      },
    });

    return res.status(201).json({
      id: cliente.id,
      nome: cliente.nome,
      telefone: cliente.telefone,
      aceitouLGPD: cliente.aceitouLGPD,
    });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno do servidor!' });
  }
};

// Salvar medidas do cliente
export const salvarMedidas = async (req: Request, res: Response) => {
  try {
    const { clienteId, altura, peso, busto, cintura, quadril, tamanho } = req.body;

    if (!clienteId || !altura || !peso || !busto || !cintura || !quadril || !tamanho) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios!' });
    }

    const medidasExistentes = await prisma.medidas.findUnique({
      where: { clienteId },
    });

    let medidas;

    if (medidasExistentes) {
      medidas = await prisma.medidas.update({
        where: { clienteId },
        data: { altura, peso, busto, cintura, quadril, tamanho },
      });
    } else {
      medidas = await prisma.medidas.create({
        data: { clienteId, altura, peso, busto, cintura, quadril, tamanho },
      });
    }

    return res.json(medidas);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno do servidor!' });
  }
};