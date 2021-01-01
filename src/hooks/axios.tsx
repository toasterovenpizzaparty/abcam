import React, { useState, useEffect, useContext, useCallback } from "react";
import { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { AxiosContext } from "../providers/axios";

type AxiosState = {
  isLoading: boolean;
  data?: AxiosResponse;
  error?: AxiosError;
};

const mergeConfigurations = (
  configurationA: AxiosRequestConfig,
  configurationB?: AxiosRequestConfig
) => {
  if (configurationA && configurationB) {
    return { ...configurationA, ...configurationB };
  }
  return configurationA;
};

export const useAxios = () => useContext(AxiosContext);

export const useAxiosCache = (config: AxiosRequestConfig) => {
  const { client } = useContext(AxiosContext);
  const [state, setState] = useState<AxiosState>({
    isLoading: false,
  });

  const fetchData = useCallback(async (optionalConfig?: AxiosRequestConfig) => {
    setState((state) => ({ ...state, isLoading: true }));
    try {
      const data = await client.request(
        mergeConfigurations(config, optionalConfig)
      );
      setState({ data, isLoading: false });
      return data;
    } catch (error) {
      setState({ error, isLoading: false });
      return error;
    }
  }, []);

  return { ...state, fetchData };
};

// Creates a hook that pulls in the API Response upon mount.
/* export const useAxiosMount = (config: AxiosRequestConfig) => {
  const axios = useAxios(config);

  useEffect(() => {
    axios.fetchData();
  }, []);

  return axios;
}; */
