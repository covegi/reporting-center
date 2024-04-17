export interface Report {
    id: string;
    name: string;
    description: string;
    todos: Array<Todo>;
  }
  
  export interface Todo {
    description: string;
    completed: boolean;
  }
  