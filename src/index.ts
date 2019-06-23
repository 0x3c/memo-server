import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import { createConnection, getManager } from "typeorm";
import "reflect-metadata";
import { WorkItem } from "./entity/workItem";
const app = new Koa();
const router: Router = new Router();

const PORT = 6001;

createConnection();

router.get("/items", async (ctx, next) => {
  const workItemRepos = getManager().getRepository(WorkItem);
  //
  try {
    const workItems = await workItemRepos.find({ order: { created: "DESC" } });
    ctx.res.write(JSON.stringify({ ok: true, data: workItems }));
    ctx.res.end();
  } catch (error) {
    ctx.res.write(JSON.stringify({ ok: false }));
    ctx.res.end();
  }
});
router.post("/items", async (ctx, next) => {
  const { text } = ctx.request.body;

  const wrokitem = new WorkItem();
  wrokitem.text = text;
  const workItemRepos = getManager().getRepository(WorkItem);

  try {
    const resp = await workItemRepos.save(wrokitem);
    ctx.res.write(JSON.stringify({ ok: true, data: resp }));
    ctx.res.end();
  } catch (error) {
    ctx.res.write(JSON.stringify({ ok: false }));
    ctx.res.end();
  }
});

router.delete("/:id", async (ctx, next) => {
  const { id } = ctx.params;
  const workItemRepos = getManager().getRepository(WorkItem);

  try {
    const resp = await workItemRepos.delete(id);
    ctx.res.write(JSON.stringify({ ok: true }));
    ctx.res.end();
  } catch (error) {
    ctx.res.write(JSON.stringify({ ok: false }));
    ctx.res.end();
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
    ctx.res.write(JSON.stringify({ ok: true }));
    ctx.res.statusCode = 204;
    ctx.res.end();
  } catch (error) {
    ctx.res.write(JSON.stringify({ ok: false }));
    ctx.res.end();
  }
});

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`listen at http://localhost:${PORT}`);
});
