"use server";

const getOmopConditions = async () => {
  const conditions = [
    { name: "diabetes", label: "Diabetes Type-II" },
    { name: "cancer", label: "Cancer" },
    { name: "ckd", label: "CKD" },
    { name: "coph", label: "COPH" },
  ];
  console.log("called get conditions");
  return conditions;
};

export default getOmopConditions;
