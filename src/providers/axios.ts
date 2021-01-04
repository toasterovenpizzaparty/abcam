import axios from "axios";

export const client = () => {
  return axios.create({
    baseURL: "https://private-8c57ff-stepbystep.apiary-mock.com",
    timeout: 1000,
  });
};
