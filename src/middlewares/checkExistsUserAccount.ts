import { Request, Response, NextFunction } from 'express';
import prisma from '../prismaClient'; // Assumindo que você tenha um arquivo para instanciar e exportar o cliente do Prisma

export async function checkExistsUserAccount(req: Request, res: Response, next: NextFunction) {
  const username = req.header('username');

  if (!username) {
    return res.status(400).json({ error: 'Username é obrigatório no cabeçalho.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    req.user = user;

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
}
