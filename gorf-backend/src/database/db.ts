import knex from 'knex';

const knexOptions = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
};

function test() {
  console.log('test called');
}

export default class DbClient {
  static knex = knex(knexOptions);
  static t = test();

  static runRawQuery(query: string, params: any = null) {
    return new Promise((resolve, reject) => {
      DbClient.knex
        .raw(query, params)
        .then(queryResponse => resolve(queryResponse.rows))
        .catch(reject);
    });
  }
}
