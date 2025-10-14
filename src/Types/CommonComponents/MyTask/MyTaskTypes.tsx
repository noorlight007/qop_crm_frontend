export interface TaskProps {
  id: string;
  date: string;
  caseName: string;
  clientName: string;
  company: string;
  taskName: string;
  priority: "Low" | "Normal" | "High";
  status: "Pending" | "Completed" | "Overdue";
  assignedTo: string;
  taskType: string;
  dueDate: string;
}

export interface AddTaskModalProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  newTask: Partial<TaskProps>;
  setNewTask: React.Dispatch<React.SetStateAction<Partial<TaskProps>>>;
  handleAddTask: () => void;
}

export interface EditTaskModalProps {
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  selectedTask: TaskProps | null;
  setSelectedTask: React.Dispatch<React.SetStateAction<TaskProps | null>>;
  handleEditTask: () => void;
}

export interface DeleteTaskModalProps {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (open: boolean) => void;
  selectedTask: TaskProps | null;
  handleDeleteTask: (taskId: string) => void;
}
