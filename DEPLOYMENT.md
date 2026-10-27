# IntelScope deployment checklist

## Production environment

Configure these variables on the API host. Do not commit them or put live values in `.env.example`.

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=<MongoDB connection string>
JWT_SECRET=<long random secret>
GEMINI_API_KEY=<Gemini API key>
GEMINI_MODEL=gemini-2.0-flash
CLIENT_URL=<deployed frontend URL>
```

## Verification

```powershell
npm.cmd install
npm.cmd test
npm.cmd run build
```

Start the API with `npm.cmd start --workspace server`. Deploy the `client` workspace as a static Vite application and set its API base URL if the frontend and API use different hosts.

Before production release, confirm MongoDB Atlas Network Access allows the API host, rotate any previously exposed credentials, and verify `/api/health` returns a successful response.
