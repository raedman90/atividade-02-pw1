import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

router.post('/users', userController.createUser);

router.get('/users/:username', userController.getUser);

export default router;
