import fetch from "node-fetch";

export const fetchAccount = async (username: string): Promise<any> => {
  let data;
  try {
    const response = await fetch(`https://instagram.com/${username}/?__a=1`);
    const result = await response.json();
    data = result.graphql.user;
  } catch (error) {
    return error;
  }

  return data;
};
