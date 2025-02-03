//We can run this project by typing this command: npm run start:dev

//Importing th express module from the express package
import express from "express";

const app = express();

//process is global in node.js and has an object caleed env (environment) , if the PORT object is not assigned, we will assign 3000
const PORT = process.env.PORT || 3000;

app.get("/", (request, response) => {
  response.status(201).send("Hello World!");
});

app.get("/api/users", (request, response) => {
  response.send([
    { id: 0, username: "teo", displayName: "Teo" },
    { id: 1, username: "cane", displayName: "Cane" },
    { id: 2, username: "amenadiel", displayName: "Amenadiel" },
  ]);
});

app.get("/api/products", (request, response) => {
  response.send([
    { id: 11, username: "french fries", price: 5.99 },
    { id: 12, username: "chicken breast", price: 12.99 },
    { id: 13, username: "cocacola", price: 0.99 },
  ]);
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
