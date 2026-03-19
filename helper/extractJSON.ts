export function extractJSON(text: string) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    console.error("Text không chứa JSON:", text);
    throw new Error("No JSON found");
  }
  try {
    return JSON.parse(match[0]);
  } catch (error: any) {
    console.error("Lỗi parse JSON. Nội dung trích xuất:", match[0]);
    throw error;
  }
}