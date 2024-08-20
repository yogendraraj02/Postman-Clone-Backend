import express from 'express';
import { createCollection, getCollections } from '../controllers/collectionController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createCollection);
router.get('/', authMiddleware, getCollections);

export default router;