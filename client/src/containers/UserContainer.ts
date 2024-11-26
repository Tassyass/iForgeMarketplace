import { useState } from "react";

type User = {
  fullName: string;
  username: string;
  email: string;
  password: string;
};

const users: User[] = []; // In-memory storage for users

export const useUserContainer = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const register = (newUser: User) => {
    const existingUser = users.find(
      (user) => user.username === newUser.username || user.email === newUser.email
    );
    if (existingUser) {
      return { ok: false, message: "Username or email already exists" };
    }
    users.push(newUser);
    return { ok: true };
  };

  const login = ({ username, password }: { username: string; password: string }) => {
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      setCurrentUser(user);
      return { ok: true };
    }
    return { ok: false, message: "Invalid username or password" };
  };

  return {
    register,
    login,
    currentUser,
  };
};
