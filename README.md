# MARIO K Official

## Σύνδεση κρατήσεων
Το site στέλνει τα αιτήματα κρατήσεων αποκλειστικά στο DJ PRO HUB μέσω Railway.
Απαιτούνται οι μεταβλητές περιβάλλοντος `RAILWAY_API_BASE` και `RAILWAY_API_KEY` στο Vercel και στο τοπικό `.env.local`.
Δεν υπάρχει εφεδρική διαδρομή κρατήσεων προς Base44.

## Περιεχόμενο και διαχείριση
Οι φωτογραφίες και το λογότυπο πρέπει ακόμη να μεταφερθούν από τις παλιές διευθύνσεις Base44 σε ανεξάρτητη φιλοξενία πριν αφαιρεθούν πλήρως οι σχετικές εξαρτήσεις.
Η διαχείριση περιεχομένου βρίσκεται στο `/admin`.
Μεταβλητές περιβάλλοντος: `ADMIN_PASSWORD`, `ADMIN_SECRET`, `GITHUB_TOKEN` (fine-grained token με Contents: read/write στο repo), προαιρετικά `GITHUB_REPO`, `GITHUB_BRANCH`.
Η αποθήκευση γράφει το `data/content.json` στο GitHub και το Vercel κάνει νέο deployment.

## Εκτέλεση
`npm install && npm run dev`
