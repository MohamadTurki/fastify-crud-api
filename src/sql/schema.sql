CREATE TABLE IF NOT EXISTS account (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    email text UNIQUE,
    password text NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS post (
    id SERIAL PRIMARY KEY,
    title text NOT NULL,
    description text,
    account_id INTEGER REFERENCES account(id) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX IF NOT EXISTS idx_account_email ON account(email);
CREATE INDEX IF NOT EXISTS idx_post_account_id ON post(account_id);
