export interface Report {
  id: string;
  name: string;
  date: string;
  downloadUrl: string[];
  description: string;
  organization: string;
  todos: Array<Todo>;
}

// TODO: These should not be optional.
// Made them this so it will work in ApiService update where the Partial utility type is shallow and this is nested in Report
export interface Todo {
  description?: string;
  completed?: boolean;
}
