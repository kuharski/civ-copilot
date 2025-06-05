import axios from "axios";

export default async function fetchJson(url) {
  const { data } = await axios.get(url);
  return data;
};
