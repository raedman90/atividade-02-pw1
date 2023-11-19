import express, { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app: Express = express();
const prisma = new PrismaClient();
app.use(express.json());

app.post('/users', async (req: Request, res: Response) => {
    const { name, username } = req.body;
  
    // Verificar se o usu�rio j� existe
    const existingUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  
    if (existingUser) {
      return res.status(400).json({ error: 'Usu�rio j� existe.' });
    }
  
    // Cria��o do usu�rio
    try {
      const newUser = await prisma.user.create({
        data: {
          name,
          username,
        },
      });
  
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar usu�rio.' });
    }
  });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
