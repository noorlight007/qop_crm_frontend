export interface SendSurveyToClientModalProps {
  isOpen: boolean;
  toggle: () => void;
  caseAlias?: string | string[] | null;
  onSuccess?: () => void;
  surveySentCount?: number;
}
