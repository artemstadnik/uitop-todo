export interface Category {
  id: number;
  name: string;
}

export interface Todo {
  id: number;
  text: string;
  categoryId: number;
  categoryName: string;
  completed: boolean;
  createdAt: string;
}
