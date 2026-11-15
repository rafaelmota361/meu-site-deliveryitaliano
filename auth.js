const API_BASE_URL = window.location.protocol === 'file:'
    ? 'http://localhost:5050'
    : window.location.origin;
const API_URL = `${API_BASE_URL}/api/auth`;

function showAlert(message, isError = true) {
    const alertBox = document.getElementById('authAlert');
    if (!alertBox) return;

    alertBox.textContent = message;
    alertBox.className = `auth-alert ${isError ? 'error' : 'success'}`;
    alertBox.classList.remove('hidden');
}

const cadastroForm = document.getElementById('cadastroForm');
if (cadastroForm) {
    cadastroForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const dto = {
            nome: document.getElementById('nome').value,
            sobrenome: document.getElementById('sobrenome').value,
            email: document.getElementById('email').value,
            cpf: document.getElementById('cpf').value,
            telefone: document.getElementById('telefone').value,
            senha: document.getElementById('senha').value
        };

        try {
            const response = await fetch(`${API_URL}/cadastrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dto)
            });

            const data = await response.json();

            if (response.ok) {
                showAlert('Cadastro realizado com sucesso! Redirecionando para login...', false);
                setTimeout(function () {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                showAlert(data.mensagem || 'Erro ao realizar cadastro.');
            }
        } catch (error) {
            showAlert('Erro de conexão com o servidor em C#.');
        }
    });
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const dto = {
            email: document.getElementById('loginEmail').value,
            senha: document.getElementById('loginSenha').value
        };

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dto)
            });

            const data = await response.json();

            if (response.ok) {
                sessionStorage.setItem('usuarioLogado', JSON.stringify(data.usuario));
                window.location.href = 'index.html';
            } else {
                showAlert(data.mensagem || 'E-mail ou senha incorretos. Tente novamente.');
            }
        } catch (error) {
            showAlert('Erro de conexão com o servidor em C#.');
        }
    });
}

function formatarCpf(digitos) {
    const d = digitos.slice(0, 11);
    let r = d.slice(0, 3);
    if (d.length > 3) r += '.' + d.slice(3, 6);
    if (d.length > 6) r += '.' + d.slice(6, 9);
    if (d.length > 9) r += '-' + d.slice(9, 11);
    return r;
}

function formatarTelefone(digitos) {
    const d = digitos.slice(0, 11);
    if (d.length === 0) return '';
    let r = '(' + d.slice(0, 2);
    if (d.length >= 2) r += ') ';
    if (d.length > 2) r += d.slice(2, 7);
    if (d.length > 7) r += '-' + d.slice(7, 11);
    return r;
}

function aplicarMascara(input, formatar) {
    if (!input) return;
    input.setAttribute('inputmode', 'numeric');
    input.addEventListener('input', function () {
        input.value = formatar(input.value.replace(/\D/g, ''));
    });
}

aplicarMascara(document.getElementById('cpf'), formatarCpf);
aplicarMascara(document.getElementById('telefone'), formatarTelefone);

const authModal = document.getElementById('authModal');

function hideAuthAlert() {
    const alertBox = document.getElementById('authAlert');
    if (alertBox) alertBox.classList.add('hidden');
}

function abrirModalCadastro() {
    if (!authModal) return;
    hideAuthAlert();
    authModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function fecharModalCadastro() {
    if (!authModal) return;
    authModal.classList.add('hidden');
    document.body.style.overflow = '';
}

if (authModal) {
    const closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
    if (closeAuthModalBtn) closeAuthModalBtn.addEventListener('click', fecharModalCadastro);

    authModal.addEventListener('click', function (e) {
        if (e.target === authModal) fecharModalCadastro();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !authModal.classList.contains('hidden')) fecharModalCadastro();
    });
}
