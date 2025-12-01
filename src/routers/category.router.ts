import { Router } from "express";
import {
  createCategory,
  getCategory,
  getTodosInCategory,
  addedTodoInCategory,
  listCategory,
  HexColor
} from "../services/category.service";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API для работы с категориями
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Получение всех категорий
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Список категорий
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 list:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */
router.get("/", async (req, res) => {
  const categories = await listCategory();
  res.json({ list: categories });
});

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Создание новой категории
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - color
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Work"
 *               color:
 *                 type: string
 *                 example: "#FF0000"
 *     responses:
 *       201:
 *         description: Созданная категория
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Ошибка валидации
 */
router.post("/", async (req, res) => {
  const { title, color } = req.body;

  if (!title || typeof title !== "string" || title.trim().length === 0)
    return res.status(400).json({ message: "Title is required and must be a non-empty string" });

  if (!color || typeof color !== "string" || color.trim().length !== 7 || color[0] !== "#")
    return res.status(400).json({ message: "Color must be a valid HEX string like #FF0000" });

  const category = await createCategory(title.trim(), color.trim() as HexColor);
  return res.status(201).json({ category });
});

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Получение конкретной категории
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID категории
 *       - in: query
 *         name: todos
 *         schema:
 *           type: boolean
 *         description: Включить задачи категории
 *     responses:
 *       200:
 *         description: Категория или категория с задачами
 *         content:
 *           application/json:
 *             schema:
 *               anyOf:
 *                 - $ref: '#/components/schemas/Category'
 *                 - $ref: '#/components/schemas/CategoryWithTodos'
 *       400:
 *         description: Некорректный ID
 *       404:
 *         description: Категория не найдена
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Id must be a number" });

  const includeTodos = req.query.todos === "true";

  try {
    if (includeTodos) {
      const categoryWithTodos = await getTodosInCategory(id);
      return res.json(categoryWithTodos);
    } else {
      const category = await getCategory(id);
      if (!category) return res.status(404).json({ message: "Category not found" });
      return res.json(category);
    }
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
});

/**
 * @swagger
 * /categories/{id}/todos:
 *   post:
 *     summary: Добавление задач в категорию
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID категории
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               todos:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Обновленные задачи категории
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categoryId:
 *                   type: integer
 *                 todos:
 *                   type: array
 *                   items:
 *                     type: integer
 *       400:
 *         description: Ошибка валидации
 *       404:
 *         description: Категория не найдена
 */
router.post("/:id/todos", async (req, res) => {
  const id = Number(req.params.id);
  const { todos } = req.body;

  if (isNaN(id)) return res.status(400).json({ message: "Category id must be a number" });
  if (!Array.isArray(todos)) return res.status(400).json({ message: "Todos must be an array of IDs" });

  try {
    const updatedTodos = await addedTodoInCategory(id, todos);
    res.json({ categoryId: id, todos: updatedTodos });
  } catch (e: any) {
    res.status(404).json({ message: e.message });
  }
});

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         color:
 *           type: string
 *           example: "#FF0000"
 *     CategoryWithTodos:
 *       allOf:
 *         - $ref: '#/components/schemas/Category'
 *         - type: object
 *           properties:
 *             todos:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *     Todo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         done:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
