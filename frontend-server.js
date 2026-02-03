import express from 'express'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = 3000

app.use(express.static('frontend'))

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/frontend/index.html')
})

app.use((request, response) => {
  response.sendFile(__dirname + '/frontend/index.html')
})

app.listen(PORT, () => {
  console.log(`Frontend rodando em http://localhost:${PORT}`)
})
