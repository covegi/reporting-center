export interface Report {
  id: string;
  name: string;
  project: string;
  contractor: string;
  description: string;
  todos: Array<Todo>;
  file: {
    name: string;
    url: string;
  };
  users: Array<string>;
}

// TODO: These should not be optional.
// Made them this so it will work in ApiService update where the Partial utility type is shallow and this is nested in Report
export interface Todo {
  description?: string;
  completed?: boolean;
}
