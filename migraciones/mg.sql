--primero ejecute
DELETE FROM philips_db.shared_todos;
--luego si pude alterar
ALTER TABLE shared_todos 
ADD CONSTRAINT unique_share UNIQUE (todo_id, shared_with_id);