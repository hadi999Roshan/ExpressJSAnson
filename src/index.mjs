//We can run this project by typing this command: (( npm run start:dev ))

//Importing the express module from the express package
import express, { response } from "express";

//Importing the query function from express validator
import {
  query,
  validationResult,
  body,
  matchedData,
  checkSchema,
} from "express-validator";

import { createUserValidationSchema } from "./utils/validationSchemas.mjs";

const app = express();

app.use(express.json());

const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method} - ${request.url}`);
  next();
};

const resolveIndexByUserId = (request, response, next) => {
  const {
    body,
    params: { id },
  } = request;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400); // Fix typo here

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1) return response.sendStatus(404);
  //Here we attach the findUserIndex property to the request to pass it between middle-wares
  request.findUserIndex = findUserIndex;
  //next() can have an argument which can be either null or an error object
  next();
};

//The middle-ware applies to all of the end-points if we use it this way, (keep in mind that it has to be used before the routes):
// app.use(loggingMiddleware);

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

//We can pass the middle-ware as an argument to apply it to the function
app.get("/", loggingMiddleware, (request, response) => {
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

//When we use a function fron express validator it creates a validation chain which can use as many operations as we want
//The validators do not throw errors, we have to haqndle them ourselves
app.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-10 characters"),
  (request, response) => {
    console.log(request);
    //The validationResult function makes the validation information appear a bit more appealing
    const result = validationResult(request);
    console.log(result);
    const {
      query: { filter, value },
    } = request;
    if (filter && value)
      return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
      );
    return response.send(mockUsers);
  }
);

app.post(
  "/api/users",
  // [
  //   body("username")
  //     .notEmpty()
  //     .withMessage("Username cannot be empty")
  //     .isLength({ min: 5, max: 32 })
  //     .withMessage(
  //       "Username must be at least 5 characters with a maximum of 32 characters"
  //     )
  //     .isString()
  //     .withMessage("Username must be a string"),
  //   body("displayname").notEmpty(),
  // ],
  checkSchema(createUserValidationSchema),
  (request, response) => {
    const result = validationResult(request);
    console.log(result);

    if (!result.isEmpty())
      return response.status(400).send({ errors: result.array() });

    //Print the validated data
    const data = matchedData(request);

    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
    mockUsers.push(newUser);
    return response.status(201).send(newUser);
  }
);

//id here is a route parameter
app.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  const findUser = mockUsers[findUserIndex];
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

app.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  // Update the user object
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return response.sendStatus(200);
});

app.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

app.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  //We pass 1 as the second argument to make sure the splice function only removes one item
  mockUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
