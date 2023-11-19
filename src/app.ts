import express, { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app: Express = express();
const prisma = new PrismaClient();
app.use(express.json());

import { checkExistsUserAccount } from './middlewares/checkExistsUserAccount';

app.post('/users', async (req: Request, res: Response) => {
    const { name, username } = req.body;
  
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  
    if (existingUser) {
      return res.status(400).json({ error: 'Usuário já existe.' });
    }
  
    // Criação do usuário
    try {
      const newUser = await prisma.user.create({
        data: {
          name,
          username,
        },
      });
  
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar usuário.' });
    }
  });

  app.post('/technologies', checkExistsUserAccount, async (req: Request, res: Response) => {
    const { title, deadline } = req.body;
    const user = req.user;
  
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
  
    try {
      const newTechnology = await prisma.technology.create({
        data: {
          title,
          deadline: deadline ? new Date(deadline) : null,
          userId: user.id,
        },
      });
  
      res.status(201).json(newTechnology);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar tecnologia.' });
    }
  });
  


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
