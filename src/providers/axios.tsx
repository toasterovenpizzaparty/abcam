import React, { createContext } from "react";
import axios, { AxiosInstance } from "axios";

export const client = () => {
  return axios.create({
    baseURL: "https://private-8c57ff-stepbystep.apiary-mock.com",
    timeout: 1000,
  });
};

export const AxiosContext = createContext({ client: client() });

export const AxiosProvider: React.FC<
  React.Provider<{ client: AxiosInstance }>
> = ({ children }) => (
  <AxiosContext.Provider value={{ client: client() }}>
    {children}
  </AxiosContext.Provider>
);
