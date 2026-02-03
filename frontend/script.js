const API_URL = 'http://localhost:5501'

// Elementos de autenticação
const authPage = document.getElementById('authPage')
const dashboardPage = document.getElementById('dashboardPage')
const loginSection = document.getElementById('loginSection')
const cadastroSection = document.getElementById('cadastroSection')
const loginForm = document.getElementById('loginForm')
const cadastroForm = document.getElementById('cadastroForm')
const toggleToCadastro = document.getElementById('toggleToCadastro')
const toggleToLogin = document.getElementById('toggleToLogin')
const themeToggle = document.getElementById('themeToggle')
const themeToggleDash = document.getElementById('themeToggleDash')
const logoutBtn = document.getElementById('logoutBtn')
const addUserBtn = document.getElementById('addUserBtn')
const usersGrid = document.getElementById('usersGrid')
const loginError = document.getElementById('loginError')
const cadastroError = document.getElementById('cadastroError')

let usuarioLogado = null

// Verificar tema salvo
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme')
    updateThemeButtons('☀️ Tema Claro')
  } else {
    updateThemeButtons('🌙 Tema Escuro')
  }
}

function updateThemeButtons(text) {
  themeToggle.textContent = text
  if (themeToggleDash) {
    themeToggleDash.textContent = text
  }
}

// Alternar tema
function toggleTheme() {
  document.body.classList.toggle('dark-theme')

  if (document.body.classList.contains('dark-theme')) {
    localStorage.setItem('theme', 'dark')
    updateThemeButtons('☀️ Tema Claro')
  } else {
    localStorage.setItem('theme', 'light')
    updateThemeButtons('🌙 Tema Escuro')
  }
}

// Alternar entre login e cadastro
function showLogin() {
  loginSection.classList.add('active')
  cadastroSection.classList.remove('active')
  loginError.classList.remove('show')
  loginError.textContent = ''
}

function showCadastro() {
  loginSection.classList.remove('active')
  cadastroSection.classList.add('active')
  cadastroError.classList.remove('show')
  cadastroError.textContent = ''
}

// Fazer login
async function handleLogin(event) {
  event.preventDefault()

  const nome = document.getElementById('loginNome').value.trim()
  const senha = document.getElementById('loginSenha').value.trim()

  if (!nome || !senha) {
    showError(loginError, 'Preencha todos os campos')
    return
  }

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nome, senha })
    })

    const data = await response.json()

    if (!response.ok) {
      showError(loginError, data.erro || 'Erro ao fazer login')
      return
    }

    usuarioLogado = data.usuario
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado))
    showDashboard()
    loginForm.reset()

  } catch (error) {
    console.error('Erro:', error)
    showError(loginError, 'Erro ao conectar com o servidor')
  }
}

// Fazer cadastro
async function handleCadastro(event) {
  event.preventDefault()

  const nome = document.getElementById('cadastroNome').value.trim()
  const idade = document.getElementById('cadastroIdade').value.trim()
  const senha = document.getElementById('cadastroSenha').value.trim()
  const timeFavorito = document.getElementById('cadastroTime').value.trim()
  const cadastroBtn = document.getElementById('cadastroBtn')

  if (!nome || !idade || !senha || !timeFavorito) {
    showError(cadastroError, 'Preencha todos os campos')
    return
  }

  cadastroBtn.disabled = true
  cadastroBtn.textContent = 'Cadastrando...'

  try {
    const response = await fetch(`${API_URL}/cadastro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nome, idade, senha, timeFavorito })
    })

    const data = await response.json()

    if (!response.ok) {
      showError(cadastroError, data.erro || 'Erro ao cadastrar')
      cadastroBtn.disabled = false
      cadastroBtn.textContent = 'Cadastrar'
      return
    }

    cadastroError.classList.remove('show')
    cadastroError.textContent = ''
    showLogin()
    document.getElementById('loginNome').value = nome
    cadastroForm.reset()
    cadastroBtn.disabled = false
    cadastroBtn.textContent = 'Cadastrar'

  } catch (error) {
    console.error('Erro:', error)
    showError(cadastroError, 'Erro ao conectar com o servidor')
    cadastroBtn.disabled = false
    cadastroBtn.textContent = 'Cadastrar'
  }
}

// Mostrar/esconder mensagens de erro
function showError(element, message) {
  element.textContent = message
  element.classList.add('show')
}

// Mostrar dashboard
async function showDashboard() {
  authPage.classList.remove('active')
  dashboardPage.classList.add('active')
  mostrarMensagemBoasVindas()
  await loadUsuarios()
}

// Esconder dashboard e voltar ao login
function showAuthPage() {
  authPage.classList.add('active')
  dashboardPage.classList.remove('active')
  showLogin()
}

// Carregar usuários
async function loadUsuarios() {
  try {
    const response = await fetch(`${API_URL}/usuarios`)
    const usuarios = await response.json()

    usersGrid.innerHTML = ''

    usuarios.forEach((usuario, index) => {
      const cardClass = `card-${(index % 4) + 1}`
      const userCard = document.createElement('div')
      userCard.className = `user-card ${cardClass}`

      userCard.innerHTML = `
        <h3>${usuario.nome}</h3>
        <div class="user-card-info">
          <div class="info-item">Age:</span>
            <span class="info-value">${usuario.idade} anos</span>
          </div>
          <div class="info-item">
            <span class="info-label">
            <span class="info-label">Time:</span>
            <span class="info-value">${usuario.timeFavorito}</span>
          </div>
        </div>
      `

      usersGrid.appendChild(userCard)
    })

  } catch (error) {
    console.error('Erro ao carregar usuários:', error)
  }
}

// Mostrar mensagem de boas-vindas
function mostrarMensagemBoasVindas() {
  const welcomeText = document.getElementById('welcomeText')
  if (usuarioLogado) {
    const mensagens = [
      `Bem-vindo de volta, ${usuarioLogado.nome}! 🎉 Que ótimo te ver aqui novamente!`,
      `Olá ${usuarioLogado.nome}! Estamos felizes por você estar de volta! ⚽`,
      `${usuarioLogado.nome}, é uma alegria tê-lo(a) aqui! Vamos torcer juntos? 💚💙`,
      `Bem-vindo(a) ao seu espaço, ${usuarioLogado.nome}! Que bom estar com você! 🌟`
    ]
    const mensagemAleatoria = mensagens[Math.floor(Math.random() * mensagens.length)]
    welcomeText.textContent = mensagemAleatoria
  }
}

//  console.error('Erro ao carregar usuários:', error)
  

// Logout
function handleLogout() {
  usuarioLogado = null
  localStorage.removeItem('usuarioLogado')
  showAuthPage()
}

// Verificar se há usuário logado ao carregar a página
function checkUsuarioLogado() {
  const usuarioSalvo = localStorage.getItem('usuarioLogado')
  if (usuarioSalvo) {
    usuarioLogado = JSON.parse(usuarioSalvo)
    showDashboard()
  }
}

// Event listeners
themeToggle.addEventListener('click', toggleTheme)
themeToggleDash.addEventListener('click', toggleTheme)
toggleToCadastro.addEventListener('click', showCadastro)
toggleToLogin.addEventListener('click', showLogin)
loginForm.addEventListener('submit', handleLogin)
cadastroForm.addEventListener('submit', handleCadastro)
logoutBtn.addEventListener('click', handleLogout)
addUserBtn.addEventListener('click', showAuthPage)

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme()
  checkUsuarioLogado()
})
