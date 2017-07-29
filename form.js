let fs = require("fs")
let util = require("util")

let Koa = require("koa")
let logger = require("koa-logger")
let KoaRouter = require("koa-router")
let koaStatic = require("koa-static")
let koaBody = require("koa-body")

let dbFile = "db.json"
fs.writeFile(dbFile, "[]", function(err) {
  if(err) console.error(err)
}) 

let readFileAsync = util.promisify(fs.readFile)

let app = new Koa()

let router = new KoaRouter()

app.use(logger())
app.use(koaStatic("./public"))
app.use(koaBody())


router.get("/", async (ctx, next) => {
  let formHtml = await readFileAsync("./templates/form.html")

  ctx.set("Content-Type", "text/html")
  ctx.response.body = formHtml

  await next()
})

router.post("/", async (ctx, next) => {
  let formData = ctx.request.body
  let fileData = await readFileAsync(dbFile)
  
  let db = JSON.parse(fileData)
  db.push(formData)

  fs.writeFile(dbFile, JSON.stringify(db), (err) => {
    if(err) console.error(err)
  })

  ctx.response.body = db

  await next()
})

app.use(router.routes())

app.listen(3000, () => {
  console.log("Server is listening on port 3000")
})