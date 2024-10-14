import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, sign, verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  //Extract the userID and then pass on the the routes
  next();
});

blogRouter.post("/blog", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const body = await c.req.json();
    const Blog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: "1",
      },
    });
  } catch (error) {
    c.status(411);
    return c.json({
      message: "Failed to create the account",
    });
  }
});
blogRouter.put("/blog", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const body = await c.req.json();
    const Blog = await prisma.post.update({
      where: {
        id: body.id,
      },

      data: {
        title: body.title,
        content: body.content,
      },
    });
  } catch (error) {
    c.status(411);
    return c.json({
      message: "Failed to find the user to update",
    });
  }
});

blogRouter.get("/blog/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    const Blog = await prisma.post.findFirst({
      where: {
        id: body.id,
      },
    });
  } catch (error) {
    c.status(411);
    return c.json({
      message: "Error while Fetching the request",
    });
  }
});
