import { Request, Response } from 'express';
import Collection from '../models/Collection.js';

export const createCollection = async (req: Request, res: Response) => {
  try {
    const { name, requests } = req.body;
    const userId = (req as any).userId;
    const collection = new Collection({ name, requests, user: userId });
    await collection.save();
    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ message: 'Error creating collection' });
  }
};

export const getCollections = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const collections = await Collection.find({ user: userId });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching collections' });
  }
};