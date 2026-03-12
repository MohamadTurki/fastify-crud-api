CREATE TABLE IF NOT EXISTS "user" (
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
    user_id INTEGER REFERENCES "user"(id) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX IF NOT EXISTS idx_user_email ON "user"(email);
CREATE INDEX IF NOT EXISTS idx_post_user_id ON post(user_id);
