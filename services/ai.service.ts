export const aiService = {
  /**
   * Generates the structured prompt with listing data to copy/feed into AI models.
   */
  buildDescriptionPrompt(landData: Record<string, unknown>): string {
    const jsonString = JSON.stringify(landData, null, 2);

    return `Below is the data of a land listing that I want to sell.

Please generate a professional real-estate property description suitable for a premium land listing platform.

Requirements:

- Write in a professional and trustworthy tone.
- Mention the location naturally.
- Mention road access if available.
- Mention possible uses of the land.
- Mention investment potential where appropriate.
- Keep the description realistic and believable.
- Do not use bullet points.
- Write in a single flowing paragraph.
- The description should be approximately 400-500 characters.
- The description should be around 3-4 lines when displayed on a typical desktop screen.
- Keep the content concise and information-dense.
- Do not write long marketing content.
- Do not repeat the same information in different words.
- Do not invent information not present in the data.
- Return only the final description.
- Do not add headings, labels, markdown, or quotation marks.

Land Data:

${jsonString}`;
  },

  /**
   * Placeholder function for direct integration (e.g. OpenAI, Claude, Gemini API) in the future.
   * Currently, it simply formats the prompt using buildDescriptionPrompt.
   */
  async generateDescription(landData: Record<string, unknown>): Promise<string> {
    const prompt = this.buildDescriptionPrompt(landData);

    // In the future, this can execute a direct API call without changing the UI flow:
    // const response = await fetch('/api/ai/generate-description', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ prompt })
    // });
    // const data = await response.json();
    // return data.description;

    return Promise.resolve(prompt);
  }
};
