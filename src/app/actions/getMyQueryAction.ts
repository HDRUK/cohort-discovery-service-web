"use server";

const getMyQueryAction = async () => {
  console.log("calling server side");
  return {
    combinator: "and",
    rules: [
      { field: "sex", operator: "=", value: "Female" },
      { field: "age", operator: "between", value: [50, 60] },
    ],
  };
};
export default getMyQueryAction;
