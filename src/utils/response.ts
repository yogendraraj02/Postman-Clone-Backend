import { Response } from "express";

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
  }
  
 export function sendResponse<T>(res: Response, statusCode: number, data?: T, error?: string) {
    const response: ApiResponse<T> = {
      success: statusCode >= 200 && statusCode < 300,
    };
  
    if (data) response.data = data;
    if (error) response.error = error;
  
    res.status(statusCode).json(response);
  }