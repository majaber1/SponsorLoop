type JsonSchema = Record<string, unknown>;

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

export const openAiConfigured = Boolean(process.env.OPENAI_API_KEY);
export const openAiModel = process.env.OPENAI_MODEL || "gpt-5.4-mini";

function outputText(payload: any) {
  if (typeof payload?.output_text === "string") return payload.output_text;
  for (const item of payload?.output || []) {
    for (const content of item?.content || []) {
      if (content?.type === "output_text" && typeof content.text === "string") return content.text;
    }
  }
  return "";
}

export async function generateStructured<T>({
  name,
  instructions,
  input,
  schema,
  maxOutputTokens = 1200
}: {
  name: string;
  instructions: string;
  input: unknown;
  schema: JsonSchema;
  maxOutputTokens?: number;
}): Promise<{ data: T; model: string; responseId?: string } | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      authorization: `Bearer ${key}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: openAiModel,
      instructions,
      input: typeof input === "string" ? input : JSON.stringify(input),
      max_output_tokens: maxOutputTokens,
      text: { format: { type: "json_schema", name, strict: true, schema } }
    }),
    signal: AbortSignal.timeout(25000)
  });
  if (!response.ok) {
    const detail = await response.text();
    console.error("openai_response_error", response.status, detail.slice(0, 500));
    return null;
  }
  const payload = await response.json();
  const text = outputText(payload);
  if (!text) return null;
  try {
    return { data: JSON.parse(text) as T, model: payload.model || openAiModel, responseId: payload.id };
  } catch {
    console.error("openai_invalid_structured_output", text.slice(0, 500));
    return null;
  }
}
