import { prisma } from "../db/prisma";

// Интерфейс TODO
export type Todo = {
  id: number;
  title: string;
  done: boolean;
}

/**
 * Возвращает массив из всех TODO в БД.
 *
 * @returns {Todo[]} Список TODO.
 */
export async function listTodo() {
  const todos = await prisma.todo.findMany({
    orderBy: {
      id: "asc",
    }
  }) as Todo[];

  return todos.map((todo) => ({
    id: todo.id,
    title: todo.title,
    done: todo.done
  }));
}

/**
 * Создает новый TODO с заданным title и добавляет его в БД.
 *
 * @param {string} title - Заголовок TODO.
 * @returns {Todo} Новый TODO.
 */
export async function createTodo(title: Todo['title']) {
  const todo = await prisma.todo.create({
    data: {
      title: title,
    }
  }) as Todo;

  return {
    id: todo.id,
    title: todo.title,
    done: todo.done
  }
}

/**
 * Переключает TODO с заданным id в противоположное состояние.
 *
 * @param {Todo['id']} id - ID TODO.
 * @returns {Todo | null} TODO или null, если TODO не найден.
 */
export async function toggleTodo(id: Todo['id']) {
  const found = await prisma.todo.findUnique({
    where: {
      id: id
    }
  })

  if (!found) return null;

  const todo = await prisma.todo.update({
    where: {
      id: id
    },
    data: {
      done: !found.done
    }
  }) as Todo;

  return {
    id: todo.id,
    title: todo.title,
    done: todo.done
  }
}

/**
 * Удаляет TODO с заданным id из хранилища.
 *
 * @param {Todo['id']} id - ID TODO.
 * @returns {boolean} true, если TODO был удален, false - в противном случае.
 */
export async function deleteTodo(id: Todo['id']) {
  const found = await prisma.todo.findUnique({
    where: {
      id: id,
    },
  });

  if (!found) return null;

  await prisma.todo.delete({
    where: {
      id: id,
    },
  });

  return {
    id: found.id,
    title: found.title,
    done: found.done
  }
}

/**
 * Обновляет заголовок TODO с заданным id.
 *
 * @param {Todo['id']} id - ID TODO.
 * @param {Todo['title']} title - Новый заголовок TODO.
 * @returns {Todo | undefined} Обновленный TODO или undefined, если TODO не найден.
 */
export async function updateTodo(id: Todo['id'], title: Todo['title']) {
  const found = await prisma.todo.findUnique({
    where: {
      id: id,
    },
  });

  if (!found) return null;

  const todo = await prisma.todo.update({
    where: {
      id: id,
    },
    data: {
      title: title
    },
  }) as Todo;

  return {
    id: todo.id,
    title: todo.title,
    done: todo.done,
  };
}

/**
 * Возвращает TODO с заданным id или undefined, если TODO не найден.
 *
 * @param {Todo['id']} id - ID TODO.
 * @returns {Todo | undefined} TODO или undefined, если TODO не найден.
 */
export async function getTodo(id: Todo['id']) {
  const found = await prisma.todo.findUnique({
    where: {
      id: id,
    },
  });

  if (!found) return null;

  return {
    id: found.id,
    title: found.title,
    done: found.done
  }
}