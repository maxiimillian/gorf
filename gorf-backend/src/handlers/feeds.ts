import { Feed, User } from '@/types/schema';
import database from '../database/feeds';
import bcrypt from 'bcrypt';
import { errorResponse, successResponse } from '../response';
import { Request } from 'express';
import { UserRequest } from '../middlewares';

export default class FeedsHandler {
  static createFeed(req: UserRequest, name: string, description: string, parentId: number) {
    const userId = req.user.id;
    return database.createFeed(name, description, userId, parentId).then((feed: Feed) => {
        return { success: true, data: { feed }}
    })
    // TOdo: handle for unknown error and invalid input error.
    // Could maybe have this done by the route handler
  }
}
