import { Router } from "express";

const router = Router();

export default router;

router.get("/api/products", (request, response) => {
  console.log(request.headers.cookie);
  console.log(request.cookies);
  console.log(request.signedCookies);

  if (request.cookies.hello && request.cookies.hello === "world")
    return response.send([
      { id: 11, username: "french fries", price: 5.99 },
      { id: 12, username: "chicken breast", price: 12.99 },
      { id: 13, username: "cocacola", price: 0.99 },
    ]);
  return response.status(403).send({ msg: "Sorry you need the right cookie" });
});
