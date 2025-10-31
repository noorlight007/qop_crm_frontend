export interface MyTaskProps {
  alias: string;
  created_at: string;
  case_name: string;
  client_name: string;
  lender: string;
  name: string;
  case_stage: string;
  assigned_to: string;
  task_priority: string;
  status: string;
  due_date: string;
}

export interface AddTaskModalProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  newTask: Partial<MyTaskProps>;
  setNewTask: React.Dispatch<React.SetStateAction<Partial<MyTaskProps>>>;
  handleAddTask: () => void;
}

export interface EditTaskModalProps {
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  selectedTask: MyTaskProps | null;
  setSelectedTask: React.Dispatch<React.SetStateAction<MyTaskProps | null>>;
  handleEditTask: () => void;
}

export interface DeleteTaskModalProps {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (open: boolean) => void;
  selectedTask: MyTaskProps | null;
  handleDeleteTask: (taskId: string) => void;
}
