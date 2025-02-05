//We can run this project by typing this command: npm run start:dev

//Importing th express module from the express package
import express, { response } from "express";

const app = express();

app.use(express.json());

//process is global in node.js and has an object caleed env (environment) , if the PORT object is not assigned, we will assign 3000
const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 0, username: "teo", displayName: "Teo" },
  { id: 1, username: "cane", displayName: "Cane" },
  { id: 2, username: "amenadiel", displayName: "Amenadiel" },
  { id: 3, username: "chloe", displayName: "Chloe" },
  { id: 4, username: "daniel", displayName: "Daniel" },
  { id: 5, username: "linda", displayName: "Amenadiel" },
  { id: 6, username: "ella", displayName: "Ella" },
];

app.get("/", (request, response) => {
  response.status(201).send("Hello World!");
});

// app.get("/api/users", (request, response) => {
//   console.log(request.query);
//   const {
//     query: { filter, value },
//   } = request;
//   if (filter && value)
//     return response.send(
//       mockUsers.filter((user) => user[filter].includes(value))
//     );
//   //In case filter and value are undefined
//   return response.send(mockUsers);
// });

app.get("/api/users", (request, response) => {
  console.log(request.query);
  const { filter } = request.query;

  if (!filter) return response.send(mockUsers); // Return all users if no filter is provided

  const filteredUsers = mockUsers.filter(
    (user) => user.username.includes(filter) // Filter by username
  );

  return response.send(filteredUsers);
});

app.post("/api/users", (request, response) => {
  const { body } = request;
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
  mockUsers.push(newUser);
  return response.status(201).send(newUser);
});

//id here is a route parameter
app.get("/api/users/:id", (request, response) => {
  console.log(request.params);
  const parsedID = parseInt(request.params.id);
  console.log(parsedID);
  if (isNaN(parsedID))
    return response.status(400).send({ msg: "Bad Request Inavlid ID!" });
  const findUser = mockUsers.find((user) => user.id === parsedID);
  if (!findUser) return response.sendStatus(404);
  return response.send(findUser);
});

app.get("/api/products", (request, response) => {
  response.send([
    { id: 11, username: "french fries", price: 5.99 },
    { id: 12, username: "chicken breast", price: 12.99 },
    { id: 13, username: "cocacola", price: 0.99 },
  ]);
});

app.put("/api/users/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400); // Fix typo here

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1) return response.sendStatus(404);

  // Update the user object
  mockUsers[findUserIndex] = { id: parsedId, ...body };
  return response.sendStatus(200);
});

app.patch("/api/users/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400); // Fix typo here

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return response.sendStatus(404);
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

app.delete("/api/users/:id", (request, response) => {
  const {
    params: { id },
  } = request;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return response.sendStatus(404);
  //We pass 1 as the second argument to make sure the splice function only removes one item
  mockUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
