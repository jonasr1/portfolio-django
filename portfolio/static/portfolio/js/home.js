// ─── Elementos do DOM ───

const btnEditar = document.getElementById('btn-editar');
const btnSair = document.getElementById('btn-sair');
const modalLogin = document.getElementById('modal-login');
const modalEditar = document.getElementById('modal-editar');

const btnLogin = document.getElementById('btn-login');
const btnCancelarLogin = document.getElementById('btn-cancelar-login');
const btnSalvar = document.getElementById('btn-salvar');
const btnCancelarEditar = document.getElementById('btn-cancelar-editar');

const loginErro = document.getElementById('login-erro');
const editSucesso = document.getElementById('edit-sucesso');
const editErro = document.getElementById('edit-erro');

// URL base da API
const API_BASE = ''; 

// Função para verificar se o usuário está logado e mostrar/esconder o botão Sair
function verificarStatusLogin() {
    const token = localStorage.getItem('access_token');
    if (token) {
        if (btnSair) btnSair.style.display = 'inline-block';
    } else {
        if (btnSair) btnSair.style.display = 'none';
    }
}

// Verifica o status ao carregar a página
verificarStatusLogin();

// ─── Passo 1: Clicar em "Editar" ───

if (btnEditar) {
    btnEditar.addEventListener('click', function() {
        console.log("Botão Editar clicado");
        const token = localStorage.getItem('access_token');
        if (token) {
            carregarPerfil(token);
        } else {
            modalLogin.style.display = 'block';
        }
    });
}

// ─── Botão Sair ───
if (btnSair) {
    btnSair.addEventListener('click', function() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        verificarStatusLogin();
        modalEditar.style.display = 'none';
        console.log("Usuário deslogado");
    });
}

// ─── Passo 2: Fazer Login (obter JWT) ───

if (btnLogin) {
    btnLogin.addEventListener('click', function() {
        console.log("Botão Login clicado");
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        loginErro.style.display = 'none';

        fetch(API_BASE + '/api/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password }),
        })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Usuário ou senha incorretos.');
            }
            return response.json();
        })
        .then(function(data) {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            modalLogin.style.display = 'none';
            verificarStatusLogin();
            carregarPerfil(data.access);
        })
        .catch(function(erro) {
            loginErro.textContent = erro.message;
            loginErro.style.display = 'block';
        });
    });
}

// ─── Passo 3: Carregar dados do perfil (GET /api/profile/) ───

function carregarPerfil(token) {
    console.log("Carregando perfil...");
    fetch(API_BASE + '/api/profile/', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token },
    })
    .then(function(response) {
        if (!response.ok) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            verificarStatusLogin();
            modalLogin.style.display = 'block';
            throw new Error('Sessão expirada. Faça login novamente.');
        }
        return response.json();
    })
    .then(function(perfil) {
        console.log("Dados do perfil recebidos:", perfil);
        document.getElementById('edit-nome').value = perfil.name || '';
        document.getElementById('edit-descricao').value = perfil.description || '';
        document.getElementById('edit-curso').value = perfil.course || '';
        document.getElementById('edit-periodo').value = perfil.period || '';
        document.getElementById('edit-email').value = perfil.email || '';
        document.getElementById('edit-git').value = perfil.git || '';
        document.getElementById('edit-linked').value = perfil.linked || '';
        document.getElementById('edit-url_imagem').value = '';

        editSucesso.style.display = 'none';
        editErro.style.display = 'none';
        modalEditar.style.display = 'block';
    })
    .catch(function(erro) {
        console.error("Erro ao carregar perfil:", erro);
    });
}

// ─── Passo 4: Salvar alteracoes (PATCH /api/profile/) ───

if (btnSalvar) {
    btnSalvar.addEventListener('click', function() {
        console.log("Botão Salvar clicado");
        const token = localStorage.getItem('access_token');
        if (!token) {
            modalLogin.style.display = 'block';
            return;
        }

        const formData = new FormData();
        formData.append('name', document.getElementById('edit-nome').value);
        formData.append('description', document.getElementById('edit-descricao').value);
        formData.append('course', document.getElementById('edit-curso').value);
        formData.append('period', document.getElementById('edit-periodo').value);
        formData.append('email', document.getElementById('edit-email').value);
        formData.append('git', document.getElementById('edit-git').value);
        formData.append('linked', document.getElementById('edit-linked').value);

        const inputImagem = document.getElementById('edit-url_imagem');
        if (inputImagem && inputImagem.files[0]) {
            formData.append('url_imagem', inputImagem.files[0]);
        }

        console.log("Enviando PATCH para /api/profile/...");
        fetch(API_BASE + '/api/profile/', {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + token,
            },
            body: formData,
        })
        .then(function(response) {
            console.log("Resposta da API:", response.status);
            if (!response.ok) {
                return response.json().then(function(erros) {
                    throw new Error(JSON.stringify(erros));
                });
            }
            return response.json();
        })
        .then(function(perfil) {
            console.log("Perfil atualizado com sucesso:", perfil);
            editSucesso.style.display = 'block';
            editErro.style.display = 'none';
            
            // Atualiza os dados na pagina (sem recarregar) - opcional se for recarregar em seguida
            atualizarPagina(perfil);

            // Fecha o modal e recarrega a página após 1.5 segundos
            setTimeout(function() {
                modalEditar.style.display = 'none';
                editSucesso.style.display = 'none';
                location.reload();
            }, 1500);
        })
        .catch(function(erro) {
            console.error("Erro ao salvar:", erro);
            editErro.textContent = 'Erro ao salvar: ' + erro.message;
            editErro.style.display = 'block';
            editSucesso.style.display = 'none';
        });
    });
}

// ─── Passo 5: Atualizar a pagina com os novos dados ───

function atualizarPagina(perfil) {
    console.log("Atualizando elementos da página...");
    
    // Nome no cabeçalho e perfil
    const perfilNome = document.querySelector('.profile h2');
    if (perfilNome) perfilNome.textContent = perfil.name || '';
    
    const headerTitle = document.querySelector('header h1');
    if (headerTitle) headerTitle.textContent = perfil.name || 'Meu Portfólio';

    const secoes = document.querySelectorAll('.section');
    
    // Sobre Mim (primeira seção)
    if (secoes[0]) {
        const paragrafo = secoes[0].querySelector('p');
        if (paragrafo) paragrafo.textContent = perfil.description || '';
    }

    // Dados Pessoais (segunda seção)
    if (secoes[1]) {
        const ul = secoes[1].querySelector('ul');
        if (ul) {
            ul.innerHTML = 
                '<li><strong>Nome:</strong> ' + (perfil.name || '') + '</li>' +
                '<li><strong>Curso:</strong> ' + (perfil.course || '') + '</li>' +
                '<li><strong>Período:</strong> ' + (perfil.period || '') + 'º</li>';
        }
    }

    // Imagem de Perfil
    const perfilImg = document.querySelector('.profile img');
    if (perfilImg && perfil.url_imagem) {
        // Força o navegador a recarregar a imagem (evita cache)
        perfilImg.src = perfil.url_imagem + '?t=' + new Date().getTime();
    }
}

// ─── Botoes de cancelar ───

if (btnCancelarLogin) {
    btnCancelarLogin.addEventListener('click', function() {
        modalLogin.style.display = 'none';
    });
}

if (btnCancelarEditar) {
    btnCancelarEditar.addEventListener('click', function() {
        modalEditar.style.display = 'none';
    });
}
