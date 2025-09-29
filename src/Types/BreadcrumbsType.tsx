import { ReactNode } from "react";

export interface BreadcrumbsProps {
  title: string | ReactNode;
  subTitle: string;
  parent?: string;
  child?: string;
}
