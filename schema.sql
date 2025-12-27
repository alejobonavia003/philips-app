CREATE SCHEMA philips_db;

SET search_path TO philips_db;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE todos ( 
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shared_todos (
    id SERIAL PRIMARY KEY,
    todo_id INT REFERENCES todos(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    shared_with_id INT REFERENCES users(id) ON DELETE CASCADE,--compartido con
    shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- inserto dos usuarios a las tablas user 
INSERT INTO users (username, email, password_hash) VALUES 
('alejo', 'email1', '123'),
('juan', 'email2', '123');

-- agrego unos todos de ejemplo
INSERT INTO todos (user_id, title, description) VALUES
(1, 'Comprar leche', 'Ir al supermercado y comprar leche'),
(1, 'Estudiar SQL', 'Repasar los conceptos de bases de datos relacionales'),
(2, 'Hacer ejercicio', 'Salir a correr por 30 minutos'),
(2, 'Leer un libro', 'Terminar de leer el libro de ciencia ficción');

-- comparto un todo de alejo con juan
INSERT INTO shared_todos (todo_id, user_id, shared_with_id) VALUES
(1, 1, 2); -- Alejo comparte "Comprar leche" con Juan

--consultar solo los todos compartidos con juan
SELECT todos.*, shared_todos.shared_with_id FROM todos 
LEFT JOIN shared_todos ON todos.id = shared_todos.todo_id
WHERE shared_todos.shared_with_id = 2;--cambiar el 2 por el id del usuario con el que se compartieron los todos

