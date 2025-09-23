import { NoteTask } from "@/Components/General/Dashboard/CommonComponents/SingleCaseInfo/Components/CaseDetails/Components/Notes/NotesTabContent";

export interface NotesTabContentProps {
  tabId: string;
  setTabId: (id: string) => void;
}

export interface NotesViewTabProps {
  notes: NoteTask[];
}

export interface TasksViewTabProps {
  tasks: NoteTask[];
}
