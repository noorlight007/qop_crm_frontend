import { ApplicantProps } from "./ApplicantsDetailsTypes";

export interface ApplicantsUsersProps {
  applicantsData?: ApplicantProps[];
  basicTab: string;
  onTabChange?: (tabAlias: string) => void;
  isApplicantValid?: (applicant: ApplicantProps) => boolean;
}
