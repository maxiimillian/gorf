import { Request, Response } from 'express';
import HttpStatusCode from './responseCode';

export interface GorfResponse {
  success: boolean;
  statusCode: HttpStatusCode;
  message: string;
  data?: any;
}

export const errorResponse: GorfResponse = {
  success: false,
  statusCode: HttpStatusCode.BAD_REQUEST,
  message: 'Unknown Error',
};

export const successResponse: GorfResponse = {
  success: true,
  statusCode: HttpStatusCode.OK,
  message: 'Request was successful',
};

export function unauthorized(res: Response, data: Object = {}) {
  return res
    .status(HttpStatusCode.UNAUTHORIZED)
    .send({ ...errorResponse, message: 'Unauthorized request', ...data });
}

export function badRequest(res: Response, data: Object = {}) {
  return res
    .status(HttpStatusCode.BAD_REQUEST)
    .send({ ...errorResponse, message: 'Missing Token', ...data });
}
