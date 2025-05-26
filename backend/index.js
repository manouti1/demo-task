require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const port = 5000;

// Validate Gemini API key
if (!process.env.GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY is not set in environment variables');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper to extract JSON from Gemini's response
function extractJson(text) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.warn("JSON parse failed:", err);
    }
  }
  return null;
}

app.post('/api/validate-idea', async (req, res) => {
  const { idea } = req.body;
  if (!idea || typeof idea !== 'string') {
    return res.status(400).json({ error: 'Idea is required.' });
  }

  const prompt = `You are a startup mentor. Given the following startup idea, respond in JSON with:
- verdict: "Promising" or "Needs Work"
- explanation: 1-2 bullet points
- suggestion: (optional) one improvement suggestion

Startup Idea: "${idea}"`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt
    });

    const text = response.text;
    console.log("Gemini raw response:", text);

    // Attempt to parse structured JSON
    const json = extractJson(text);
    if (json) {
      res.json(json);
    } else {
      res.json({ raw: text }); // fallback for unstructured output
    }
  } catch (err) {
    console.error('Gemini API Error:', err);
    res.status(500).json({ 
      error: 'AI request failed', 
      details: err.message,
      type: err.type || 'unknown',
      code: err.code || 'unknown',
    });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
