// src/routes/technologyRoutes.ts

import express from 'express';
import * as technologyController from '../controllers/technologyController';
import { checkExistsUserAccount } from '../middlewares/checkExistsUserAccount';

const router = express.Router();

router.post('/technologies', checkExistsUserAccount, technologyController.createTechnology);

router.get('/technologies', checkExistsUserAccount, technologyController.getTechnologies);

router.put('/technologies/:id', checkExistsUserAccount, technologyController.updateTechnology);

router.patch('/technologies/:id/studied', checkExistsUserAccount, technologyController.markTechnologyAsStudied);

router.delete('/technologies/:id', checkExistsUserAccount, technologyController.deleteTechnology);

export default router;
