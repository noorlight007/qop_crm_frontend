export interface OtherOccupantsTypes {
  alias: string;
  full_name: string;
  date_of_birth?: string | null;
  relationship?: string | null;
  created_at?: string;
  updated_at?: string;
}
export interface OtherOccupantModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedOccupant?: OtherOccupantsTypes;
}