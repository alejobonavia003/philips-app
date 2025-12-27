--SOLUCION A ERROR DE QUE UN USUARIO PUEDE COMPARTIR MUCHAS VECES LA MISMA TAREA A UN MISMO USUARIO
--primero ejecute
DELETE FROM philips_db.shared_todos;
--luego si pude alterar
ALTER TABLE shared_todos 
ADD CONSTRAINT unique_share UNIQUE (todo_id, shared_with_id);

--VOY A AGREGAR SECCION DE FINANZAS Y TIEMPOS A LAS TAREAS 

SET search_path TO philips_db;

-- 1. Agregamos el estado a las tareas (Pendiente, En Progreso, Pausada, Completada)
ALTER TABLE todos ADD COLUMN status VARCHAR(20) DEFAULT 'pendiente';

-- 2. Tabla de Finanzas (Ingresos y Egresos)
CREATE TABLE IF NOT EXISTS finances (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    todo_id INT REFERENCES todos(id) ON DELETE SET NULL, -- Opcional: gasto asociado a una tarea
    amount DECIMAL(10, 2) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('ingreso', 'egreso')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Logs de Tiempo (Para el cronómetro infinito/pomodoro)
CREATE TABLE IF NOT EXISTS time_logs (
    id SERIAL PRIMARY KEY,
    todo_id INT REFERENCES todos(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP, -- Si es NULL, la tarea sigue corriendo
    duration_seconds INT DEFAULT 0
);