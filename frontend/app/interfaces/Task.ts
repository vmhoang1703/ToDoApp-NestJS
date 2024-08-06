interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  deadline?: string;
}

export default Task;
