const knex = require('knex');

export async function up(knex: any): Promise<void> {
  await knex.raw(`
    CREATE TABLE users (
        id serial PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(120) NOT NULL,
        email VARCHAR(255) UNIQUE,
        date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE feeds (
        id serial PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        author_id int4 NOT NULL,
        parent_id int4,
        description VARCHAR(500),
        date_created TIMESTAMP,
        main BOOLEAN NOT NULL DEFAULT FALSE,

        FOREIGN KEY (author_id) REFERENCES users (id)
    );

    CREATE UNIQUE INDEX idx_unique_main_feed ON feeds (author_id) WHERE main IS TRUE;

    ALTER TABLE feeds
    ADD CONSTRAINT fk_parent_id FOREIGN KEY (parent_id) REFERENCES feeds (id);

    CREATE TABLE feed_subscription (
        get_from int4 NOT NULL,
        send_to int4 NOT NULL,
        created_by int4 NOT NULL,

        FOREIGN KEY (get_from) REFERENCES feeds (id),
        FOREIGN KEY (send_to) REFERENCES feeds (id),
        FOREIGN KEY (created_by) REFERENCES users (id),
        PRIMARY KEY (get_from, send_to)
    );

    CREATE UNIQUE INDEX idx_unique_subscription ON feed_subscription(get_from, send_to);

    CREATE TABLE posts (
        id serial PRIMARY KEY,
        content VARCHAR(5000) NOT NULL,
        feed_id int NOT NULL,

        FOREIGN KEY (feed_id) REFERENCES feeds (id)
    );
`);
}

export async function down(knex: any): Promise<void> {
  await knex.raw(`
        DROP TABLE posts;
        DROP TABLE feed_subscription;
        DROP TABLE feeds;
        DROP TABLE users;
    `);
}
