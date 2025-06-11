import { Todo } from "../../generated/prisma";

export type TodoResponseData = {
  todo: Todo;
};

export type UserTodosResponseData = {
  todos: TodoResponseData["todo"][];
  totalItems: number;
  currentPage: number;
  totalPages: number;
};
