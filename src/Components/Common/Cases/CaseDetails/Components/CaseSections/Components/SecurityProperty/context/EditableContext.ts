import { createContext, useContext } from "react";

export const EditableContext = createContext<boolean>(true);
export const useIsLocked = () => useContext(EditableContext);
