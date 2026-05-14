import next from "next"
import { createServer } from "http"  
import { initSocket } from "~/server/socket"

const dev = process.env.NODE_ENV !== "production"   

const app = next({ dev })                 
const handle = app.getRequestHandler()    

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res)
  })

  initSocket(server)

  server.listen(3000, () => {
    console.log("Server running on http://localhost:3000")
  })
})