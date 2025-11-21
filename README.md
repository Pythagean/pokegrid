# PokeGrid

Small React app that loads images from a public GitHub repository folder and displays them in a responsive grid.

Quick start (PowerShell):

```powershell
cd d:\Github\pokegrid
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

Usage:
- Enter a repository `owner` and `repo` (public repos only).
- Optionally enter a `path` to the folder inside the repo and a `branch`.
- Click `Load` to fetch image files from the folder. Images are loaded using the GitHub Contents API and displayed using their `download_url`.

Notes:
- The GitHub API is used without authentication; for heavy usage or private repos you will need to provide a token and update the fetch logic.
- If the repo/folder contains no image files the app will show a message.
