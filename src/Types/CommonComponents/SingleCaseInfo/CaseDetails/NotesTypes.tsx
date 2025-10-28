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
  user:{
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
  }
  note_visible_to_introducer: boolean;
  note_visible_to_client: boolean;
  category: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

//////////////////////////
export interface NoteTask {
  alias: string;
  case: {
    alias: string;
    name: string;
    case_category: "MORTGAGE" | string;
    applicant_type: "SINGLE" | string;
    case_status: "NEW_LEAD" | string;
    case_stage: "DECISION_IN_PRINCIPLE" | string;
    created_at: string;
  };
  note_task: "TASK" | "NOTE";
  note_visible_to_introducer: boolean;
  note_visible_to_client: boolean;
  category: string | null;
  task_priority: "HIGH" | "LOW" | "" | string | null;
  due_date: string | null;
  assigned_to: number | null;
  note: string | null;
  created_by: {
    id: number;
    alias: string;
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
    profile_image: string | null;
    user_type: "LEAD" | string;
  };
  updated_by: null | {
    id: number;
    alias: string;
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
    profile_image: string | null;
    user_type: string;
  };
  created_at: string;
  updated_at: string;
}
