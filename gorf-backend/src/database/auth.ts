import bcrypt from 'bcrypt';
import DbClient from './db';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { User, UserProfile } from '@/types/schema';

const saltRounds = 10;
const jwtOptions = {
  expiresIn: '7 days',
};

export default class AuthModel {
  static async createUser(potentialUser: { name: string; password: string }) {
    const hashedPassword = await bcrypt.hash(potentialUser.password, saltRounds);
    potentialUser.password = hashedPassword;

    return DbClient.knex
      .queryBuilder()
      .insert(potentialUser)
      .into('users')
      .returning('*')
      .then(response => response[0]);
  }

  static getUser(name: string) {
    return DbClient.knex.select('*').from('users').where('name', '=', name).first();
  }

  static getProfile(name: string): Promise<UserProfile> {
    console.log()
    return AuthModel.getUser(name).then(user => {
      if (!user) return null;
      else {
        const profile: UserProfile = { name: user.name, date_created: user.date_created };
        return profile;
      }
    });
  }

  static createToken(user: User) {
    console.log(user, typeof user);
    const token = jwt.sign(user, process.env.JWT_KEY, jwtOptions);
    return token;
  }
}
