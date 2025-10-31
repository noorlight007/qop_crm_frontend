export interface TaskProps {
  id: string;
  date: string;
  caseName: string;
  clientName: string;
  company: string;
  taskName: string;
  task_priority: string;
  status: string;
  assigned_to: string;
  caseStage: string;
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
