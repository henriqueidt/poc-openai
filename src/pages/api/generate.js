import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const buildPrompt = ({ functionInput, isTest }) => {
  let suffix = "Unit tests for the above function:";
  if (!isTest) {
    suffix =
      "Inline JavaScript documentation for the above function, with an explanation of what it does:";
  }
  return `${functionInput}
${isTest ? "" : `"""`}
${suffix}${isTest ? "" : `\n\n`}`.replaceAll("\n}", "\n }");
};

const buildStop = ({ isTest }) => {
  if (isTest) {
    // prettier-ignore
    return ["\"\"\"", "//", "/*", "*/"]
  }
  // prettier-ignore
  return ["\"\"\""]
};

export default async function handler(req, res) {
  /**
   * Parameters provided to openAI model:
   * @param model The model version
   * @param prompt The prefix text that will be sent for completion
   * @param temperature How "creative" the result should be. The higher the temperature, the higher is the creativeness, but the code turns into less accurate
   * @param max_tokens The maximum size of the response
   * @param frequency_penalty (-2.0 to 2.0) Penalizes tokens for the frequency that they appear in the result
   * @param presence_penalty (-2.0 to 2.0) Penalizes tokens if they appear the result so far
   **/
  const openAiParameters = {
    model: "code-davinci-002",
    prompt: buildPrompt(req.body),
    temperature: 0,
    max_tokens: 1688,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: buildStop(req.body),
  };

  const response = await openai.createCompletion(openAiParameters);

  res.status(200).json({ result: response.data.choices[0].text });
}
