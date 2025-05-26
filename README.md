# Startup Validator

A web application that helps entrepreneurs validate their startup ideas using AI. The application provides feedback on startup ideas, including a verdict, explanation, and improvement suggestions.

## Features

- AI-powered startup idea validation
- JSON-formatted responses
- Simple and intuitive API
- Built with Node.js and Express
- Uses Google's Gemini AI model

## Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd startup-validator
```

2. Install dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Start the backend server:
```bash
npm start
```

The server will run on http://localhost:5000

## API Usage

### Validate Startup Idea

```http
POST /api/validate-idea
Content-Type: application/json

{
  "idea": "Your startup idea here"
}
```

Response:
```json
{
  "verdict": "Promising" | "Needs Work",
  "explanation": ["Point 1", "Point 2"],
  "suggestion": "Optional improvement suggestion"
}
```

## Technologies Used

- Node.js
- Express
- Google Gemini AI
- CORS
- dotenv

## License

MIT 