import Koa from "koa";
const app = new Koa();

const PORT = 6001;

app.use(async (ctx: Koa.Context) => {
  ctx.body = "Hello memo";
});

app.listen(PORT, () => {
  console.log(`listen at http://localhost:${PORT}`);
});
