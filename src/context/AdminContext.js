import { createContext, useContext } from "react";

export const AdminContext = createContext();

export function useLessonPlan() {
  return useContext(AdminContext);
}
