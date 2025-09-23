import { ReactNode } from "react";

export interface DashboardCommonHeaderType {
  title: string;
  tagClass?: string;
  dropDownFalse?: boolean;
  children?: ReactNode;
  dropdownTitle?:string;
  tablist?:boolean;
}

export interface DashBoardCommonDropdown {
  days?: boolean;
  dropdownTitle?:string;
}