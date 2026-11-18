# Knock

A neighbourhood board for small favours. Static site: HTML, CSS and vanilla JS. No build step.

## Run locally
Open `index.html` in a browser, or run `npx serve .`

## Put it on GitHub
```
cd knock
git init
git add .
git commit -m "Initial commit: Knock"
git branch -M main
git remote add origin https://github.com/<your-username>/knock.git
git push -u origin main
```
Create the empty `knock` repository on github.com first. To get a live link, open the repository's Settings, then Pages, and choose the `main` branch and `/ (root)`.

## Structure
- `index.html` page markup
- `css/style.css` styles
- `js/app.js` 3D street, board, filters and post form
