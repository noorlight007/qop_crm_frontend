export interface AddPortfolioContentModalProps {
  isOpen: boolean;
  toggle: () => void;
}

export interface DeletePropertyModalProps {
  isOpen: boolean;
  toggle: () => void;
  propertyAlias: string | null | undefined;
  propertyLabel?: string;
  onDeleteComplete?: () => void;
}

export interface UpdatePropertyModalProps {
  isOpen: boolean;
  toggle: () => void;
  property?: any | null;
}


export interface ImportCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelected: (file: File) => void;
  isImporting: boolean;
}