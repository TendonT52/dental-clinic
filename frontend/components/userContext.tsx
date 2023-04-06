import { createContext } from "react";

export const UserContext = createContext(

  {
    user: {
      dateOfBirth: "",
      email: "",
      firstName: "",
      id: 0,
      lastName: "",
      role: "GUEST",
      telephone: "",
      accessToken: "",
    },
    setUser: (user: any) => { },
  });

export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;
