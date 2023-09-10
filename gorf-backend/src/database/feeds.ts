import bcrypt from 'bcrypt';
import DbClient from './db';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Feed } from '@/types/schema';


export default class FeedModel {
    static createFeed(name: string, description: string, authorId: number, parentFeedId: number | null): Promise<Feed> {
      const feedInsert = { name, description, authorId, parentFeedId };
      return DbClient.knex.queryBuilder().insert(feedInsert).from('feeds').returning<Feed>('*');
    }
}
