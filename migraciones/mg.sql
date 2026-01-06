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


-- VOY A AGREGAR LA PARTE DE LAS MISIONES
-- 1. Tabla de Misiones
CREATE TABLE missions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL, -- Por ahora será 1
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('primaria', 'secundaria')),
    status VARCHAR(50) DEFAULT 'activa', -- activa, completada, pausada
    parent_id INTEGER REFERENCES missions(id), -- Para que una secundaria pertenezca a una primaria
    financial_goal NUMERIC(10, 2) DEFAULT 0, -- Meta de dinero (ej: 1.000.000 para el auto)
    deadline DATE, -- Meta temporal
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Actualizar Tareas para que pertenezcan a una Misión
ALTER TABLE todos 
ADD COLUMN mission_id INTEGER REFERENCES missions(id);

-- 3. Actualizar Finanzas para que (opcionalmente) se liguen directo a una Misión
-- (Aunque generalmente se ligan a través de la tarea, a veces hay gastos directos de misión)
ALTER TABLE finances 
ADD COLUMN mission_id INTEGER REFERENCES missions(id);

--decidi eliminar todo lo que serian missiones secundarias 


-- 1. Eliminar columnas dependientes
ALTER TABLE missions DROP COLUMN IF EXISTS parent_id;
ALTER TABLE missions DROP COLUMN IF EXISTS type;

SET search_path TO philips_db;

-- Habit Tracker
CREATE TABLE habits (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    frequency VARCHAR(50) DEFAULT 'daily', -- daily, weekly
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE habit_logs (
    id SERIAL PRIMARY KEY,
    habit_id INT REFERENCES habits(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    UNIQUE(habit_id, date)
);

-- Planificación Diaria
ALTER TABLE todos ADD COLUMN scheduled_date DATE DEFAULT CURRENT_DATE;
