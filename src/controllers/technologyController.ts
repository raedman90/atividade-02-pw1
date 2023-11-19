import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createTechnology = async (req: Request, res: Response) => {
  const { title, deadline } = req.body;
  const username = req.header('username');

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const technology = await prisma.technology.create({
      data: {
        title,
        deadline: new Date(deadline),
        userId: user.id,
      },
    });

    res.status(201).json(technology);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar tecnologia.' });
  }
};

export const getTechnologies = async (req: Request, res: Response) => {
  const username = req.header('username');

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      include: {
        technologies: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json(user.technologies);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar tecnologias.' });
  }
};

export const updateTechnology = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, deadline } = req.body;
    const username = req.header('username');
  
    if (!username) {
      return res.status(400).json({ error: 'Username é obrigatório no cabeçalho.' });
    }
  
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });
  
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }
  
      const technology = await prisma.technology.findFirst({
        where: {
          id: id,
          userId: user.id,
        },
      });
  
      if (!technology) {
        return res.status(404).json({ error: 'Tecnologia não encontrada.' });
      }
  
      // Resto da lógica para atualizar a tecnologia...
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar tecnologia.' });
    }
  };
  

export const markTechnologyAsStudied = async (req: Request, res: Response) => {
    const { id } = req.params;
    const username = req.header('username');
  
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });
  
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }
  
      const technology = await prisma.technology.findFirst({
        where: {
          id: id,
          userId: user.id,
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
          studied: true,
        },
      });
  
      res.json(updatedTechnology);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao marcar tecnologia como estudada.' });
    }
  };

  export const deleteTechnology = async (req: Request, res: Response) => {
    const { id } = req.params;
    const username = req.header('username');
  
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });
  
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }
  
      const technology = await prisma.technology.findFirst({
        where: {
          id: id,
          userId: user.id,
        },
      });
  
      if (!technology) {
        return res.status(404).json({ error: 'Tecnologia não encontrada.' });
      }
  
      await prisma.technology.delete({
        where: {
          id: id,
        },
      });
  
      res.status(200).json({ message: 'Tecnologia deletada com sucesso.' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar tecnologia.' });
    }
  };
  
  
  