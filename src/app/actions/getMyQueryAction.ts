"use server";

import sendQuery from "../methods/sendQuery";

const getMyQueryAction = async (query: any) => {
  sendQuery(query);
};
export default getMyQueryAction;
