# CardSnap

A Japanese flashcard maker that lets you take pictures of Japanese text or paste sentences, select target words, and export cards directly to Anki or as a CSV for any SRS app.

**Live app: https://cardsnap.vercel.app**

---

## Using the Web App

The web app works for CSV export without any setup. Simply visit the live app, paste or upload Japanese text, create your cards and download the CSV to import into your SRS app of choice.

---

## Running Locally with AnkiConnect

Running the app locally lets you export cards directly to Anki with one click via AnkiConnect.

### 1. Clone the repository
```bash
git clone https://github.com/Willhargrave/anki-helper.git
cd anki-helper
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root:
```
VITE_AZURE_VISION_KEY=your_azure_key
VITE_AZURE_VISION_ENDPOINT=your_azure_endpoint
```

If you don't have Azure credentials the app will still work for text paste — only the image upload feature requires Azure.

### 4. Run the app
```bash
npm run dev
```

The app will be running at `http://localhost:5173`

---

## Setting up AnkiConnect

### 1. Install the AnkiConnect plugin

- Open Anki
- Go to **Tools → Add-ons → Get Add-ons**
- Enter code **2055492159**
- Restart Anki

### 2. Configure AnkiConnect permissions

- Go to **Tools → Add-ons → AnkiConnect → Config**
- Update the config to allow requests from CardSnap:
```json
{
  "apiKey": null,
  "apiLogPath": null,
  "ignoreOriginList": [],
  "webBindAddress": "127.0.0.1",
  "webBindPort": 8765,
  "webCorsOriginList": [
    "http://localhost",
    "http://localhost:5173",
  ]
}
```

- Restart Anki

### 3. Keep Anki open

Anki must be running in the background for AnkiConnect to work. With Anki open and the app running locally, the **Export to Anki** button will appear on the flashcard form.

---

## Tech Stack

- **Vue 3** with TypeScript and Composition API
- **Vite** for bundling
- **Pinia** for state management
- **Jisho API** for Japanese dictionary lookups
- **MyMemory API** for translations
- **Azure Computer Vision** for image OCR
- **AnkiConnect** for direct Anki integration
