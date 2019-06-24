import Koa from "koa";
import Router from "koa-router";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import { createConnection, getManager } from "typeorm";
import "reflect-metadata";
import { WorkItem } from "./entity/workItem";
const app = new Koa();
const router: Router = new Router();

const PORT = 6001;

createConnection();
app.use(cors());

router.get("/items", async (ctx, next) => {
  const workItemRepos = getManager().getRepository(WorkItem);
  //
  try {
    const workItems = await workItemRepos.find({ order: { created: "DESC" } });
    ctx.response.status = 200;
    ctx.body = { ok: true, data: workItems };
  } catch (error) {
    ctx.response.status = 400;
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
    ctx.response.status = 200;
    ctx.body = { ok: true, data: resp };
  } catch (error) {
    ctx.response.status = 400;
    ctx.body = { ok: false };
  }
});

router.delete("/:id", async (ctx, next) => {
  const { id } = ctx.params;
  const workItemRepos = getManager().getRepository(WorkItem);

  try {
    const resp = await workItemRepos.delete(id);
    ctx.response.status = 200;
    ctx.body = { ok: true };
  } catch (error) {
    ctx.response.status = 400;
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
    ctx.response.status = 200;
    ctx.body = { ok: true };
  } catch (error) {
    ctx.response.status = 400;
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
