import { ReactNode } from "react";

export interface BreadcrumbItemConfig {
  label: string | ReactNode;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbsProps {
  title: string | ReactNode;
  subTitle: string;
  items?: BreadcrumbItemConfig[];
}
