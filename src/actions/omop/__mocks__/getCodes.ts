import { ApiResponse, Code } from "@/types/api";

const getCodes = async (domain: string): Promise<ApiResponse<Code[]>> => {
  const codesByDomain: Record<string, Code[]> = {
    condition: [
      { name: "319835", name: "Essential hypertension" },
      { name: "201826", description: "Type 2 diabetes mellitus" },
    ],
    drug: [
      { name: "19019073", description: "Aspirin" },
      { name: "19059793", description: "Metformin" },
    ],
    measurement: [
      { name: "3004249", description: "Blood glucose measurement" },
      { name: "3004501", description: "Hemoglobin A1c measurement" },
    ],
    observation: [
      { name: "4135373", description: "Smoking status" },
      { name: "40762499", description: "Alcohol use" },
    ],
    procedure: [
      { name: "2000001", description: "Appendectomy" },
      { name: "2000002", description: "Colonoscopy" },
    ],
  };

  return {
    data: codesByDomain[domain] || [],
    message: codesByDomain[domain]
      ? "success"
      : `No codes found for domain '${domain}'`,
  };
};

export default getCodes;
