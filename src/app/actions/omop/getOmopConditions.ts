"use server";

const getOmopConditions = async () => {
  //placeholder
  // - will be an API call once implemented
  const conditions = [
    { name: 4323688, label: "Cough" },
    { name: 35626061, label: "No Cough Strength" },
    { name: 40386778, label: "Diabetes Type-II" },
    { name: 4194405, label: "Cancer" },
    { name: 46284566, label: "CKD" },
    { name: 255573, label: "COPD" },
    { name: 40481087, label: "Viral sinusitis" },
    { name: 4112343, label: "Acute viral pharyngitis" },
    { name: 260139, label: "Acute bronchitis" },
    { name: 4217975, label: "Normal pregnancy" },
    { name: 4311629, label: "Impaired glucose tolerance" },
    { name: 316866, label: "Hypertensive disorder" },
    { name: 257012, label: "Chronic sinusitis" },
    { name: 4078393, label: "Miscarriage in first trimester" },
    { name: 372328, label: "Otitis media" },
  ];
  return conditions;
};

export default getOmopConditions;
