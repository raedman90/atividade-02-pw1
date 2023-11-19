import { User } from '@prisma/client';
import express, { Express, Request, Response, NextFunction } from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app: Express = express();
app.use(express.json());

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

async function checkExistsUserAccount(req: Request, res: Response, next: NextFunction) {
  const { username } = req.headers;

  if (!username) {
    return res.status(400).json({ error: 'Username � obrigat�rio no header.' });
  }

  const user = await prisma.user.findUnique({
    where: { username: String(username) },
  });

  if (!user) {
    return res.status(404).json({ error: 'Usu�rio n�o existe.' });
  }

  req.user = user; // Adicionando o usu�rio ao objeto de requisi��o
  next();
}

app.get('/technologies', checkExistsUserAccount, async (req: Request, res: Response) => {
    const user = req.user;
  
    if (!user) {
      return res.status(404).json({ error: 'Usu�rio n�o encontrado.' });
    }
  
    try {
      const technologies = await prisma.technology.findMany({
        where: {
          userId: user.id,
        },
      });
  
      res.json(technologies);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar tecnologias.' });
    }
  });
  
