# AquaBit

AquaBit is a single-player aquarium game built with HTML, CSS, and JavaScript.

## Run locally

Open `aquario.html` in a browser, or serve this folder with a local HTTP server.

## Check fish interactions

With Selenium and Microsoft Edge installed, start `python -m http.server 8777` in one terminal and run `python test_interactions.py` in another.

## Deploy to Vercel

Import this GitHub repository into Vercel. No build command or framework preset is required; `vercel.json` routes the site root to `aquario.html`.

Game progress is saved in the browser's local storage and does not sync between devices.

Fish show animated three-frame emoji bubbles to signal their needs and react to feeding, affection, cleaning, and play.

Fish have species-specific appetite, playfulness, cleanliness, shyness, affinity, and schooling behavior. Their names can be changed in the fish details.

Click or focus a fish in the tank to open its quick interactions. Roll a visual 1d6, ask for a trick, give individual affection, or invite a compatible fish to play. Bond and friendship progress are saved; occasional visitors, found shells, and playful calls add optional surprises. Fish also collect floating coins automatically, or players can tap a coin to collect it themselves.
