import { Router } from "express";
import { createTodo, deleteTodo, getTodo, listTodo, toggleTodo, updateTodo } from "../services/todo.service";

const router = Router();

// Вывод всех TODO
router.get("/", (req, res) => {
  res.json({ list: listTodo() });
});

// Создание TODO
router.post("/", (req, res) => {

  // Получаем нашу 
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  if (typeof title !== "string") {
    return res.status(400).json({ message: "Title must be a string" });
  }

  if (title.trim().length === 0) {
    return res.status(400).json({ message: "Title cannot be empty" });
  }

  const todo = createTodo(title.trim());
  return res.status(201).json({ todo });
});

// Выборка конкретного TODO
router.get("/:id", (req, res) => {
  // Получаем ID из url
  const { id } = req.params;

  // Проверяем ялвялется ли это числом
  if (isNaN(Number(id))) {
    return res.status(400).json({ message: "Id must be a number" });
  }

  // Получаем нашу TODO запись
  const todo = getTodo(Number(id));

  // Если TODO не найдено!
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  // Возвращаем рузультат поиска TODO
  return res.json({ todo });
});

// Обновление конкретного TODO по ID ()
router.put("/:id", (req, res) => {
  // Получаем ID из url
  const { id } = req.params;

  // Проверяем ялвялется ли это числом
  if (isNaN(Number(id))) {
    return res.status(400).json({ message: "Id must be a number" });
  }

  if (!req.body.title) {
    return res.status(400).json({ message: "Title is required" });
  }

  // Проверяем ялвялется ли это строкой
  if (typeof req.body.title !== "string") {
    return res.status(400).json({ message: "Title must be a string" });
  }

  // Проверяем ялвялется ли это строкой
  if (req.body.title.trim().length === 0) {
    return res.status(400).json({ message: "Title cannot be empty" });
  }

  // Получаем нашу TODO запись
  const todo = getTodo(Number(id));

  // Если TODO не найдено!
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  // Обновляем нашу TODO запись
  const updatedTodo = updateTodo(Number(id), req.body.title.trim());

  // Возвращаем рузультат поиска TODO
  return res.json({ todo: updatedTodo });
});

router.patch('/:id', (req, res) => {
  // Получаем ID из url
  const { id } = req.params;

  // Проверяем ялвялется ли это числом
  if (isNaN(Number(id))) {
    return res.status(400).json({ message: 'Id must be a number' });
  }

  if (!req.body.title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  // Проверяем ялвялется ли это строкой
  if (typeof req.body.title !== 'string') {
    return res.status(400).json({ message: 'Title must be a string' });
  }

  // Проверяем ялвялется ли это строкой
  if (req.body.title.trim().length === 0) {
    return res.status(400).json({ message: 'Title cannot be empty' });
  }

  // Получаем нашу TODO запись
  const todo = getTodo(Number(id));

  // Если TODO не найдено!
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  // Обновляем нашу TODO запись
  const updatedTodo = updateTodo(Number(id), req.body.title.trim());

  // Возвращаем рузультат поиска TODO
  return res.json({ todo: updatedTodo });
});

// Удаление конкретного TODO по ID
router.delete("/:id", (req, res) => {
  // Получаем ID из url
  const { id } = req.params;

  // Проверяем ялвялется ли это числом
  if (isNaN(Number(id))) {
    return res.status(400).json({ message: "Id must be a number" });
  }

  // Получаем нашу TODO запись
  const todo = getTodo(Number(id));

  // Если TODO не найдено!
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  // Удаляем нашу TODO запись
  const deleted = deleteTodo(Number(id));

  // Возвращаем рузультат поиска TODO
  return res.json({ deleted });
});

router.get("/:id/toggle", (req, res) => {
  // Получаем ID из url
  const { id } = req.params;

  // Проверяем ялвялется ли это числом
  if (isNaN(Number(id))) {
    return res.status(400).json({ message: "Id must be a number" });
  }

  // Получаем нашу TODO запись
  const todo = getTodo(Number(id));

  // Если TODO не найдено!
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  // Переключаем нашу TODO запись
  const toggled = toggleTodo(Number(id));

  // Возвращаем рузультат поиска TODO
  return res.json({ toggled });
});

export default router;