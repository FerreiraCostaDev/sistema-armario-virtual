import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { v4 as uuidv4 } from 'uuid';

export const gerarQRCode = async (req: Request, res: Response) => {
  try {
    const lojaId = (req as any).lojaId;

    const codigo = uuidv4();
    const expiresEm = new Date(Date.now() + 60 * 60 * 1000);

    const qrcode = await prisma.qRCode.create({
      data: {
        codigo,
        lojaId,
        expiresEm,
      },
    });

    const url = `http://localhost:3000/cliente/${qrcode.codigo}`;

    return res.json({
      id: qrcode.id,
      codigo: qrcode.codigo,
      url,
      expiresEm: qrcode.expiresEm,
    });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno do servidor!' });
  }
};

export const verificarQRCode = async (req: Request, res: Response) => {
  try {
    const codigo = req.params.codigo as string;

    const qrcode = await prisma.qRCode.findUnique({
      where: { codigo },
      include: { loja: true },
    });

    if (!qrcode) {
      return res.status(404).json({ erro: 'QR Code não encontrado!' });
    }

    if (!qrcode.ativo) {
      return res.status(400).json({ erro: 'QR Code inativo!' });
    }

    if (new Date() > qrcode.expiresEm) {
      return res.status(400).json({ erro: 'QR Code expirado!' });
    }

    return res.json({
      valido: true,
      loja: {
        id: qrcode.loja.id,
        nome: qrcode.loja.nome,
      },
      qrcodeId: qrcode.id,
    });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno do servidor!' });
  }
};