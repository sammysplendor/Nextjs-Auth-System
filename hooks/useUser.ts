import { create } from "zustand";

export interface UserProps {
  id: string;
  name: string;
  role: string;
  email: string;
  emailVerify: boolean;
  hasDeletePermission: boolean;
}

interface UserModalProps {
  user: UserProps;
  setUser: (user: UserProps) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const useUser = create<UserModalProps>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  setUser: (user: UserProps) => set({ user }),
  user: {
    id: "",
    name: "",
    role: "",
    email: "",
    emailVerify: false,
    hasDeletePermission: false,
  },
}));

export default useUser;
