import { Router } from "express";

const router = Router();

export default router;

router.get("/api/products", (request, response) => {
  response.send([
    { id: 11, username: "french fries", price: 5.99 },
    { id: 12, username: "chicken breast", price: 12.99 },
    { id: 13, username: "cocacola", price: 0.99 },
  ]);
});
