# Antius

## Set up for local development

To set Antius up for local development, create a `.env` file in this directory containing `JWT_SECRET=<SECRET>` where `<SECRET>` is the secret JWT key used for signing and verifying JWT tokens. Make sure MongoDB is installed and listening on port `27017` with no password, or set `MONGODB_URL` in the `.env` file. Run `yarn dev` and Antius will begin listening on port `3000`.
