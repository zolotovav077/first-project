import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Тип HEX-цвета прямо здесь
export type HexColor = `#${string}`;

// Создание категории
export async function createCategory(title: string, color: HexColor) {
  return prisma.category.create({
    data: { title, color },
  });
}

// Получение всех категорий
export async function listCategory() {
  return prisma.category.findMany();
}

// Получение категории по ID
export async function getCategory(id: number) {
  return prisma.category.findUnique({ where: { id } });
}

// Добавление задач в категорию
export async function addedTodoInCategory(categoryId: number, todosId: number[]) {
  const updatedTodos = await Promise.all(
    todosId.map(async (todoId) => {
      return prisma.todo.update({
        where: { id: todoId },
        data: { categoryId },
      });
    })
  );
  return updatedTodos.map(t => t.id);
}

// Получение категории с задачами
export async function getTodosInCategory(categoryId: number) {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { todos: true },
  });

  if (!category) throw new Error("Category not found");
  return category;
}
