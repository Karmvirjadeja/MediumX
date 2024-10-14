import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, sign, verify } from "hono/jwt";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

//Here c is a context

app.post("api/v1/blog", (c) => {
  return c.text("Hello Hono!");
});
app.put("api/v1/blog", (c) => {
  return c.text("Hello Hono!");
});
app.get("api/v1/blog/:id", (c) => {
  return c.text("Hello Hono!");
});

export default app;
