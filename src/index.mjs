//We can run this project by typing this command: npm run start:dev

//Importing th express module from the express package
import express from "express";

const app = express();

//process is global in node.js and has an object caleed env (environment) , if the PORT object is not assigned, we will assign 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
