export interface NotesTabContentProps {
  tabId: string;
  setTabId: (id: string) => void;
}

export interface NotesViewTabProps {
  notes: NoteProps[];
}

export interface TasksViewTabProps {
  tasks: TaskProps[];
}
export interface NoteProps {
  alias: string;
  case: {
    alias: string;
    name: string;
    case_category: string;
    applicant_type: string;
    case_status: string;
    case_stage: string;
    created_at: string;
  };
  user: {
    id: number;
    alias: string;
    email: string;
    phone: string;
    title: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    profile_image: string | null;
    user_type: string;
  };
  note_visible_to_introducer: boolean;
  note_visible_to_client: boolean;
  category: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}
export interface TaskProps {
  alias: string;
  case: {
    alias: string;
    name: string;
    case_category: string;
    applicant_type: string;
    case_status: string;
    case_stage: string;
    created_at: string;
  };
  assigned_user: {
    id: number;
    alias: string;
    email: string;
    phone: string;
    title: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    profile_image: string | null;
    user_type: string;
  };
  name: string;
  task_priority: string;
  due_date: Date | null;
  assigned_to: number | null;
  note: string | null;
  created_by: {
    id: number;
    alias: string;
    email: string;
    phone: string;
    title: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    profile_image: string | null;
    user_type: string;
  };
  created_at: string;
  updated_at: string;
}

export interface AddNoteModalProps {
  isOpen: boolean;
  toggle: () => void;
}

export interface AddTaskModalProps {
  isOpen: boolean;
  toggle: () => void;
}

export interface DeleteNoteModalProps {
  isOpen: boolean;
  toggle: () => void;
  caseAlias: string;
  selectedNote?: NoteProps | null;
}
