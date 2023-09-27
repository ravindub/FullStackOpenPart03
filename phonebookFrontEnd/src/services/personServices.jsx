import axios from "axios";
const baseUrl = "/api/persons";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newName) => {
  const request = axios.post(baseUrl, newName);
  return request.then((response) => response.data);
};

const update = (id, newNum) => {
  const request = axios.put(`${baseUrl}/${id}`, newNum);
  return request.then((response) => response.data);
};

const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

export default {
  getAll,
  create,
  update,
  deletePerson,
};
