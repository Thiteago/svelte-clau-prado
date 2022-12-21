import axios from 'axios';

export const api = new axios.create({
  baseURL: 'http://localhost:3333',
});
