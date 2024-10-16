import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, sign, verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { Hono } from "hono";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    userId: string;
  };
}>();

// blogRouter.use("/*", async (c, next) => {
//   //Extract the userID and then pass on the the routes
//   const authHeader = c.req.header("authorization") || "";
//   const user = await verify(authHeader, "mysecretpassword");
//   console.log(user.id);
//   if (user) {
//     await next();
//   } else {
//     c.status(403);
//     return c.json({
//       message: "You are not logged in ",
//     });
//   }
// });

blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const body = await c.req.json();
    console.log(body);

    const Blog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: "1",
      },
    });
    console.log(Blog);
    c.status(200);
    return c.json({
      Blog,
    });
  } catch (error) {
    c.status(411);
    return c.json({
      message: "Failed to create the account",
    });
  }
});

blogRouter.put("/", async (c) => {
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

blogRouter.get("/", async (c) => {
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

//Todo Add : Pagination
blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const blogs = await prisma.post.findMany();

  return c.json({
    blogs,
  });
});
