# MARIO K Official
Οι φωτογραφίες και το λογότυπο φορτώνονται προσωρινά από το Base44 (`data/content.json`). Κατέβασέ τα και βάλε τα δικά σου links όταν αποσυνδεθείς από το Base44.
Χρειάζεται `.env.local` με `DJPRO_API_BASE` και `DJPRO_API_KEY`. Τρέξιμο: `npm install && npm run dev`.

## Admin (`/admin`)
Env (Vercel + .env.local): `ADMIN_PASSWORD`, `ADMIN_SECRET` (τυχαίο μακρύ κείμενο), `GITHUB_TOKEN` (fine-grained, Contents: read/write στο repo), προαιρετικά `GITHUB_REPO`, `GITHUB_BRANCH`.
Η αποθήκευση γράφει το `data/content.json` στο GitHub και το Vercel κάνει νέο deploy.
