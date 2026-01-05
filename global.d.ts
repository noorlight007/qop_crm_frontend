// Global CSS module declarations
declare module "*.css";
declare module "*.scss";
declare module "*.sass";

// For CSS modules with typed classes
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.sass" {
  const classes: { [key: string]: string };
  export default classes;
}

// Minimal typings for react-color (ChromePicker, ColorResult)
declare module "react-color" {
  export interface ColorResult {
    hex: string;
    [key: string]: any;
  }

  export const ChromePicker: any;
}
