import { User } from '../database/schema';
import database from '../database/auth';
import bcrypt from 'bcrypt';
import { errorResponse, successResponse } from '../response';

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

  static register(name: string, password: string, email: string) {
    const user = { name, password, email };
    return database.createUser(user).then((user: User) => {
      const token = database.createToken(user);
      return { success: true, data: { name: user.name, token } };
    });
  }
}
