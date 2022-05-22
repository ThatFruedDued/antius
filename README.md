# Antius
the best social media platform

## How to use
Install [MongoDB](https://www.mongodb.com/try/download/community) and set it to listen on port `27017` with no access protection (or set up a custom configuration in `next-app/.env` like `MONGODB_URL=<custom url>`). Install [Node.js](https://nodejs.org/en/) and run `sudo npm i -g yarn` to install yarn, the package manager of choice for this project. Set the JWT secret key in `next-app/.env` like `JWT_SECRET=<secret key>`. A strong, randomly generated password is recommended for this. Use the command line to `cd` into the `next-app` folder. Then, run `yarn install` to automatically download and install the required packages, `yarn build` to prepare the files for a production envirnoment, and finally `yarn start` to start the server. By default, the server will listen on port `3000`, so you can simply navigate to `http://localhost:3000` in your web browser to access Antius.
