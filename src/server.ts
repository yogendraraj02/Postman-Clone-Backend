// src/server.ts
import express, { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import { makeRequest, RequestConfig, ResponseData } from './utils/requestMethods.js';
import { sendResponse } from './utils/response.js';
import connectDB from './config/database.js';
import Collection from './models/Collection.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);


// async function connectToDatabase() {
//   try {
//     await client.connect();
//     console.log('Connected to MongoDB');
//     return client.db('postman_clone'); 
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//     process.exit(1);
//   }
// }

app.get('/', (_req, res) => {
  res.send('Postman Clone API');
  
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/collections', collectionRoutes);


app.post('/api/proxy',async (req:Request,res:Response) => {
  try {
    const requestConfig: RequestConfig = req.body;
    const result: ResponseData = await makeRequest(requestConfig);

    sendResponse(res, result.status, {
      data: result.data,
      headers: result.headers,
      responseTime: result.responseTime,
      status : result.status
    });
  } catch (error) {
    const errorResponse = error as { status: number; error: string };
    sendResponse(res, errorResponse.status || 500, undefined, errorResponse.error || 'An unexpected error occurred');
  }
})


async function startServer() {
  try{
    const db = await connectDB();
    console.log(`db connected`);
    
    // Example route using the database
    app.get('/api/collections', async (req, res) => {
      const collections = await Collection.find();
      res.json(collections);
    });
  } catch(e){
    console.log(`error on database connect`,e);
    
  }
  

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer().catch(console.error);