import { User } from '../@types/schema';
import database from '../database/auth';
import bcrypt from 'bcrypt';
import { GorfResponse, errorResponse, successResponse } from '../response';
import HandlerResponse from '@/types/handlerResponse';

export default class AuthHandler {
  static login(username: string, potentialPassword: string) {
    return database
      .getUser(username)
      .then((user: User) => {
        const isCorrectPassword = bcrypt.compareSync(potentialPassword, user.password);
        if (!isCorrectPassword) throw new Error();

        const token = database.createToken(user);
        return { success: true, data: { token } };
      })
      .catch(_error => {
        return { success: false, message: 'Invalid username or password' };
      });
  }

  static async register(name: string, password: string, email: string) {
    const user = { name, password, email };
    const existingUser = await database.getUser(name);
    if (existingUser) return { success: false, message: 'Username already in use'};

    const newUser = await database.createUser(user);
    const token = database.createToken(newUser);

    return { success: true, data: { name: newUser.name, token }};
  }
}
