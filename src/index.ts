import Koa from "koa";
import Router from "koa-router";
import cors from "@koa/cors";
import koajwt from "koa-jwt";
import jwt from "jsonwebtoken";
import bodyParser from "koa-bodyparser";
import { createConnection, getManager, ConnectionOptions } from "typeorm";
import "reflect-metadata";
import { WorkItem } from "./entity/workItem";
import { User } from "./entity/user";
import { secret, issuer } from "./configs";
const configs = require("../ormconfig");
const app = new Koa();
const router: Router = new Router();

const PORT = 6001;

createConnection(configs);
app.use(cors());
app.use((ctx, next) => {
  return next().catch(err => {
    if (401 === err.status) {
      ctx.status = 401;
      ctx.body = {
        ok: false,
        message: err.originalError ? err.originalError.message : err.message
      };
    } else {
      throw err;
    }
  });
});

app.use(
  koajwt({ secret }).unless({
    path: ["/login", "/register"]
  })
);

router.post("/register", async (ctx, next) => {
  const userRepos = getManager().getRepository(User);
  const { username, password } = ctx.request.body;
  const user = new User();
  user.username = username;
  user.password = password;

  try {
    const userInfo = await userRepos.save(user);

    ctx.status = 200;
    ctx.body = {
      ok: true,
      data: userInfo
    };
  } catch (error) {
    ctx.status = 400;
    ctx.body = { ok: false };
  }
});

router.post("/login", async (ctx, next) => {
  const userRepos = getManager().getRepository(User);
  const { username, password } = ctx.request.body;
  try {
    const user = await userRepos.findOne({ username, password });
    if (!user) {
      ctx.status = 400;
      ctx.body = {
        ok: false,
        message: "not exisit"
      };
      return;
    }

    const token =
      "Bearer " +
      jwt.sign({ issuer }, secret, {
        expiresIn: Date.now() + 1000 * 60
      });
    ctx.status = 200;
    ctx.body = {
      ok: true,
      data: { ...user, token }
    };
  } catch (error) {
    ctx.status = 400;
    ctx.body = { ok: false, message: error };
  }
});

router.get("/items", async (ctx, next) => {
  const workItemRepos = getManager().getRepository(WorkItem);
  try {
    const workItems = await workItemRepos.find({ order: { created: "DESC" } });
    ctx.status = 200;
    ctx.body = { ok: true, data: workItems };
  } catch (error) {
    ctx.status = 400;
    ctx.body = { ok: false };
  }
});
router.post("/items", async (ctx, next) => {
  const { text } = ctx.request.body;
  const wrokitem = new WorkItem();
  wrokitem.text = text;
  const workItemRepos = getManager().getRepository(WorkItem);
  try {
    const resp = await workItemRepos.save(wrokitem);
    ctx.status = 200;
    ctx.body = { ok: true, data: resp };
  } catch (error) {
    ctx.status = 400;
    ctx.body = { ok: false };
  }
});

router.delete("/:id", async (ctx, next) => {
  const { id } = ctx.params;
  const workItemRepos = getManager().getRepository(WorkItem);

  try {
    const resp = await workItemRepos.delete(id);
    ctx.status = 200;
    ctx.body = { ok: true };
  } catch (error) {
    ctx.status = 400;
    ctx.body = { ok: false };
  }
});

router.put("/:id", async (ctx, next) => {
  const { id } = ctx.params;
  const { checked } = ctx.request.body;
  const workItemRepos = getManager().getRepository(WorkItem);

  try {
    const resp = await workItemRepos.update(id, {
      checked
    });
    ctx.status = 200;
    ctx.body = { ok: true };
  } catch (error) {
    ctx.status = 400;
    ctx.body = { ok: false };
  }
});

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`listen at http://localhost:${PORT}`);
});
