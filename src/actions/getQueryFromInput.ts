"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const geminiModelName = process.env.GEMINI_MODEL_NAME || "gemini-2.5-flash";
const genAI = new GoogleGenerativeAI(apiKey);

const systemInstruction =
  " \
You are a helpful assistant that ONLY replies in a JSON format \
that matches the React Query Builder schema. \
\
You convert natural language into a valid React Query Builder JSON object. \
Respond ONLY with JSON, no explanations.\
\
Available fields are: \
- 'sex': values are 'Male', 'Female', or 'Other' \
- 'age': supports '=', '>', '<', '>=', '<=', 'between' \
- 'condition': supports '=' and '!=' operators and expects a string value \
   - these are things like lung cancer or diabetes \
- 'measurements': supports '=' and '!=' operators and expects a string value \
   - these are things like measurements of antibodies, of blood pressure etc \
- 'drug_exposure': supports '=' and '!=' operators and expects a string value \
   - these are exposures to drugs or vaccines etc. \
- 'observation': supports '=' and '!=' operators and expects a string value \
   - these are things like smoking station or history of diabetes \
\
For example, for a query of 'females between the age of 50 and 60' you would return:\
{\
  'combinator': 'and',\
  'rules': [\
    { 'field': 'sex', 'operator': '=', 'value': 'Female' }, \
    { 'field': 'age', 'operator': 'between', 'value': [50, 60] } \
  ]\
}\
\
For a query like 'patients with diabetes', you would return:\
{\
  'combinator': 'and',\
  'rules': [\
    { 'field': 'condition', 'operator': '=', 'value': 'diabetes' } \
  ]\
}\
";

const model = genAI.getGenerativeModel({
  model: geminiModelName,
  systemInstruction,
});

const getQueryFromInput = async (input: string) => {
  try {
    const promt = `User input was: ${input}`;
    const result = await model.generateContent(promt);
    const { response } = result;
    const text = response.text();

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
      throw new Error("Could not locate valid JSON in model response.");
    }

    const jsonString = text.slice(jsonStart, jsonEnd + 1);

    const parsed = JSON.parse(jsonString);

    return parsed;
  } catch (err) {
    console.error("Error generating query from input:", err);
    return {
      error: "Failed to parse query. Please try rephrasing your request.",
      details: err instanceof Error ? err.message : String(err),
    };
  }
};

export default getQueryFromInput;
