import { mockUsers } from "./constants.mjs";

export const resolveIndexByUserId = (request, response, next) => {
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
