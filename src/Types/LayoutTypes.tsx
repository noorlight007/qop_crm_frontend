import { ReactNode } from "react";

export interface MenuItem {
  badge?: string;
  title: string;
  lanClass?: string;
  Items?: MenuItem[];
  id?: number;
  icon?: string | ReactNode;
  type?: string;
  active?: boolean;
  children?: MenuItem[];
  path?: string;
  mainTitle?: string;
  allowedRoles?: string[];
}

export interface MenuListType {
  menu?: MenuItem[] | undefined;
  level: number;
  setActiveMenu: Function;
  activeMenu: unknown[];
}

export interface SidebarItemTypes {
  item: {
    id?: number;
    title?: string | undefined;
    icon?: string | ReactNode;
    type?: string;
    active?: boolean;
    path?: string;
    children?: SidebarChildrenType[];
    lanClass?: string;
  };
}

export interface SidebarChildrenType {
  path?: string;
  title: string;
  type: string;
  lanClass?: string;
  children?: SubChildrenType[];
}

export interface SubChildrenType {
  title: string;
  type: string;
  path: string;
}

export interface SearchSuggestionListType {
  searchedArray: SearchSuggestionItem[];
  setSearchedWord: (key: string) => void;
}

export interface SearchSuggestionItem {
  icon?: string | ReactNode;
  title: string;
  path: string;
  bookmarked?: boolean;
  id?: number;
}

export interface PropsTypes {
  mainTitle: string;
  parent: string;
  title?: string;
}

export interface TabCustomizerType {
  toggle: () => void;
}

export interface ConfigurationProp {
  modalToggle: () => void;
  modal: boolean;
}

export interface LanguageDataType {
  icon: string;
  logo: string;
  title: string;
}
