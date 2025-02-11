//We can run this project by typing this command: (( npm run start:dev ))

//Importing the express module from the express package
import express, { response } from "express";

import routes from "./routes/index.mjs";

import cookieParser from "cookie-parser";

import session from "express-session";

import { mockUsers } from "./utils/constants.mjs";

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

import { resolveIndexByUserId } from "./utils/middlewares.mjs";

const app = express();

//We must keep in mind that the session should be called before routes are registered
//The session function generates a new session id for the user each time that they refresh the page, however, we have to modify the code to make sure unnecessary sessions and ID's aren't generated
app.use(express.json());
app.use(
  session({
    secret: "anson the dev",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
      //This value is measured in miliseconds
    },
  })
);
//When you don't want to save unmodified session data to the session sotre, this allows us to avoid making unnecessary saves to the server which would slow it down
//Resave has to so with forcing a session to be saved back to the session store
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
  console.log(request.session);
  console.log(request.session.id);
  request.session.visited = true;
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

app.post("/api/auth", (request, response) => {
  const {
    body: { username, password },
  } = request;
  const findUser = mockUsers.find((user) => user.username === username);
  if (!findUser || findUser.password !== password)
    return response.sendStatus(401).send({ msg: "BAD CREDENTIALS!!" });

  request.session.user = findUser;
  return response.status(200).send(findUser);
});

app.get("/api/auth/status", (request, response) => {
  request.sessionStore.get(request.sessionID, (err, session) => {
    console.log(session);
  });
  return request.session.user
    ? response.status(200).send(request.session.user)
    : response.status(401).send({ msg: "Not authenticated" });
});

app.post("/api/cart", (request, response) => {
  if (!request.session.user) return response.sendStatus(401);
  const { body: item } = request;
  const { cart } = request.session;
  if (cart) {
    cart.push(item);
  } else {
    request.session.cart = [item];
  }
  return response.status(201).send(item);
});

app.get("/api/cart", (request, response) => {
  if (!request.session.user) return response.sendStatus(401);
  return response.send(request.session.cart ?? []);
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
