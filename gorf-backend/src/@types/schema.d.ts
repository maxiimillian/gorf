import { Knex } from 'knex';

export interface User {
  id: number;
  name: string;
  password: string;
  email: string;
  date_created: Date;
}

export interface UserProfile {
  name: string;
  date_created: Date;
}

export interface Feed {
  name: string;
  description: string;
  date_created: Date;
  authorId: number;
  author?: User;
  parentId: number;
  parent?: Feed;
}

declare module 'knex/types/tables' {      
  interface Tables {
    users: User;
    users_composite: Knex.CompositeTableType<
      User,
      Pick<User, 'name'> & Partial<Pick<User, 'date_created'>>,
      Partial<Omit<User, 'id'>>
    >;
  }
}