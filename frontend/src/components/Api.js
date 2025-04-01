const API_URL = "http://localhost:8000/analyze/";

export async function analyzeCode(code, language) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, language }),
  });

  if (!response.ok) throw new Error("服务器错误");
  return await response.json();
}
