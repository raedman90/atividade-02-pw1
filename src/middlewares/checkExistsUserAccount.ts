import { Request, Response, NextFunction } from 'express';
import prisma from '../prismaClient'; // Assumindo que voc� tenha um arquivo para instanciar e exportar o cliente do Prisma

export async function checkExistsUserAccount(req: Request, res: Response, next: NextFunction) {
  const username = req.header('username');

  if (!username) {
    return res.status(400).json({ error: 'Username � obrigat�rio no cabe�alho.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usu�rio n�o encontrado.' });
    }
    req.user = user;

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar usu�rio.' });
  }
}
