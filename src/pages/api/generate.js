import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const buildPrompt = ({ functionInput, testsCount = 1 }) => {
  return `
    // Javascript
    ${functionInput}

    // Unit tests with ${testsCount} expects
  `;
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
    prompt: buildPrompt(req.body) || "",
    temperature: 0,
    max_tokens: 1024,
    frequency_penalty: 0.5,
    presence_penalty: 0.5,
  };

  const response = await openai.createCompletion(openAiParameters);

  res.status(200).json({ result: response.data.choices[0].text });
}
