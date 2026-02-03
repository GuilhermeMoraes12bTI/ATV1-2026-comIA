import express from 'express'

const app = express()
const PORT = 5501

app.use(express.json())

app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*')
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  next()
})

let usuarios = []

app.post('/cadastro', (request, response) => {
  const { nome, senha, timeFavorito, idade } = request.body

  if (!nome || !senha || !timeFavorito || !idade) {
    return response.status(400).json({ erro: 'Nome, senha, age e time são obrigatórios' })
  }

  const usuarioExistente = usuarios.find(u => u.nome.toLowerCase() === nome.toLowerCase())
  if (usuarioExistente) {
    return response.status(400).json({ erro: 'Usuário já existe' })
  }

  const novoUsuario = {
    id: Date.now(),
    nome,
    senha,
    timeFavorito,
    idade: parseInt(idade)
  }

  usuarios.push(novoUsuario)
  response.status(201).json({ mensagem: 'Usuário cadastrado com sucesso', usuario: { id: novoUsuario.id, nome: novoUsuario.nome, timeFavorito: novoUsuario.timeFavorito, idade: novoUsuario.idade } })
})

app.post('/login', (request, response) => {
  const { nome, senha } = request.body

  if (!nome || !senha) {
    return response.status(400).json({ erro: 'Nome e senha são obrigatórios' })
  }

  const usuario = usuarios.find(u => u.nome === nome && u.senha === senha)

  if (!usuario) {
    return response.status(401).json({ erro: 'Usuário ou senha incorretos' })
  }

  response.status(200).json({
    mensagem: 'Login realizado com sucesso',
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      timeFavorito: usuario.timeFavorito,
      idade: usuario.idade
    }
  })
})

app.get('/usuarios', (request, response) => {
  const usuariosPublicos = usuarios.map(u => ({
    id: u.id,
    nome: u.nome,
    idade: u.idade,
    timeFavorito: u.timeFavorito
  }))
  response.status(200).json(usuariosPublicos)
})

app.delete('/logout/:id', (request, response) => {
  response.status(200).json({ mensagem: 'Logout realizado com sucesso' })
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
