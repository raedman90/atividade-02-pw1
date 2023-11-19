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

export async function checkExistsUserAccount(req: Request, res: Response, next: NextFunction) {
  const { username } = req.headers;

  if (!username) {
    return res.status(400).json({ error: 'Username é obrigatório no header.' });
  }

  const user = await prisma.user.findUnique({
    where: { username: String(username) },
  });

  if (!user) {
    return res.status(404).json({ error: 'Usuário não existe.' });
  }

  req.user = user; // Adicionando o usuário ao objeto de requisição
  next();
}

app.get('/technologies', checkExistsUserAccount, async (req: Request, res: Response) => {
    const user = req.user;
  
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
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
  
  app.put('/technologies/:id', checkExistsUserAccount, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, deadline } = req.body;
    const user = req.user;
  
    if (!user) {
      return res.status(404).json({ error: 'Usuário não existe.' });
    }
  
    try {
      const technology = await prisma.technology.findFirst({
        where: {
          id: id,
          userId: user.id, // Garante que a tecnologia pertence ao usuário
        },
      });
  
      if (!technology) {
        return res.status(404).json({ error: 'Tecnologia não encontrada.' });
      }
  
      const updatedTechnology = await prisma.technology.update({
        where: {
          id: id,
        },
        data: {
          title: title,
          deadline: deadline ? new Date(deadline) : null,
        },
      });
  
      res.json(updatedTechnology);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar tecnologia.' });
    }
  });
  
