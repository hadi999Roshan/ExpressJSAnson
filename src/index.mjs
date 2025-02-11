//We can run this project by typing this command: (( npm run start:dev ))

//Importing the express module from the express package
import express, { response } from "express";

import routes from "./routes/index.mjs";

import cookieParser from "cookie-parser";

//Importing the query function from express validator
// import {
//   query,
//   validationResult,
//   body,
//   matchedData,
//   checkSchema,
// } from "express-validator";

// import { createUserValidationSchema } from "./utils/validationSchemas.mjs";

// import usersRouter from "./routes/users.mjs";
// import productsRouter from "./routes/products.mjs";

import { mockUsers } from "./utils/constants.mjs";

import { resolveIndexByUserId } from "./utils/middlewares.mjs";

const app = express();

app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(routes);

// const resolveIndexByUserId = (request, response, next) => {
//   const {
//     body,
//     params: { id },
//   } = request;
//   const parsedId = parseInt(id);
//   if (isNaN(parsedId)) return response.sendStatus(400); // Fix typo here

//   const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

//   if (findUserIndex === -1) return response.sendStatus(404);
//   //Here we attach the findUserIndex property to the request to pass it between middle-wares
//   request.findUserIndex = findUserIndex;
//   //next() can have an argument which can be either null or an error object
//   next();
// };

//The middle-ware applies to all of the end-points if we use it this way, (keep in mind that it has to be used before the routes):
// app.use(loggingMiddleware);

//process is global in node.js and has an object caleed env (environment) , if the PORT object is not assigned, we will assign 3000
const PORT = process.env.PORT || 3000;

//We can pass the middle-ware as an argument to apply it to the function
app.get("/", (request, response) => {
  response.cookie("hello", "world", { maxAge: 30000, signed: true });
  response.status(201).send({ msg: "Hello" });
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
// app.get(
//   "/api/users",
//   query("filter")
//     .isString()
//     .notEmpty()
//     .withMessage("Must not be empty")
//     .isLength({ min: 3, max: 10 })
//     .withMessage("Must be at least 3-10 characters"),
//   (request, response) => {
//     console.log(request);
//     //The validationResult function makes the validation information appear a bit more appealing
//     const result = validationResult(request);
//     console.log(result);
//     const {
//       query: { filter, value },
//     } = request;
//     if (filter && value)
//       return response.send(
//         mockUsers.filter((user) => user[filter].includes(value))
//       );
//     return response.send(mockUsers);
//   }
// );

// app.post(
//   "/api/users",
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
//   checkSchema(createUserValidationSchema),
//   (request, response) => {
//     const result = validationResult(request);
//     console.log(result);

//     if (!result.isEmpty())
//       return response.status(400).send({ errors: result.array() });

//     //Print the validated data
//     const data = matchedData(request);

//     const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
//     mockUsers.push(newUser);
//     return response.status(201).send(newUser);
//   }
// );

//id here is a route parameter
app.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) return response.sendStatus(404);
  return response.send(findUser);
});

// app.get("/api/products", (request, response) => {
//   response.send([
//     { id: 11, username: "french fries", price: 5.99 },
//     { id: 12, username: "chicken breast", price: 12.99 },
//     { id: 13, username: "cocacola", price: 0.99 },
//   ]);
// });

// app.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
//   const { body, findUserIndex } = request;
//   // Update the user object
//   mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
//   return response.sendStatus(200);
// });

// app.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
//   const { body, findUserIndex } = request;
//   mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
//   return response.sendStatus(200);
// });

// app.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
//   const { findUserIndex } = request;
//   //We pass 1 as the second argument to make sure the splice function only removes one item
//   mockUsers.splice(findUserIndex, 1);
//   return response.sendStatus(200);
// });

/* Cookies are small pieces of data that a web server sends to the browser
Cookies are important because the qweb server can send a cookie to the web browser and then the web browser can send a cookie to the web server anytime it needs to make a request, it is important because by default HTTP is 
stateless, which means that whenever you send a request the web browser doesn't know where that request is coming from.  
For instance, when creating an e-commerce website, if we want to implement the feature for the uaser to add items to their cart and for them to still be there when they come back later, we have to use cookies.
In real-world applications we use cookies along with sessions.
We can uze the Cookie Parser application to see the cookies in a better format
*/

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
