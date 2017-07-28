let fs = require('fs')

let Koa = require("koa")
let logger = require("koa-logger")
let KoaRouter = require("koa-router")
let koaStatic = require("koa-static")
let koaBody = require("koa-body")

let file = "db.json"

let app = new Koa()

let router = new KoaRouter()

app.use(logger())
app.use(koaStatic("./public"))
app.use(koaBody())


router.get("/", async (ctx, next) => {
  let formHtml = await new Promise((resolve, reject) => {
    fs.readFile("form.html", (err, data) => {
      if(err) reject(err)
      resolve(data)
    })
  })

  ctx.set('Content-Type', 'text/html')
  ctx.response.body = formHtml

  await next()
})

router.post("/", async (ctx, next) => {
  let formData = ctx.request.body
  let fileData = await new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if(err) reject(err)
      resolve(data)
    })
  })

  let db = JSON.parse(fileData)
  db.push(formData)

  fs.writeFile(file, JSON.stringify(db), (err) => {
    if(err) console.error(err)
  })

  ctx.response.body = db

  await next()
})

app.use(router.routes())

app.listen(3000, () => {
  console.log("Server is listening on port 3000")
})