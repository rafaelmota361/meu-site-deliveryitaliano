function getUsuarioLogado() {
    try {
        const str = sessionStorage.getItem('usuarioLogado');
        return str ? JSON.parse(str) : null;
    } catch {
        return null;
    }
}

function sairDaConta() {
    sessionStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
}

function montarMenuUsuario() {
    const botao = document.getElementById('userMenuBtn');
    if (!botao) return;

    const usuario = getUsuarioLogado();
    const wrapper = botao.closest('.user-account-wrapper') || botao.parentElement;

    const antigo = document.getElementById('userDropdown');
    if (antigo) antigo.remove();

    if (!usuario || (!usuario.id && !usuario.idUsuario)) {
        botao.innerHTML = `
            <i class="fa-regular fa-user"></i>
            <span class="user-btn-text">Entrar / Cadastrar</span>`;
        botao.onclick = function () {
            if (document.getElementById('authModal') && typeof abrirModalCadastro === 'function') {
                abrirModalCadastro();
            } else {
                window.location.href = 'login.html';
            }
        };
        return;
    }

    botao.innerHTML = `<img src="icone-usuario.svg" alt="" class="user-avatar">`;
    botao.setAttribute('aria-label', 'Minha conta');
    botao.onclick = function (e) {
        e.stopPropagation();
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) dropdown.classList.toggle('open');
    };

    const nomeCompleto = [usuario.nome, usuario.sobrenome].filter(Boolean).join(' ');
    const dropdown = document.createElement('div');
    dropdown.id = 'userDropdown';
    dropdown.className = 'user-dropdown';
    dropdown.innerHTML = `
        <div class="user-dropdown-info">
            <strong>${escaparHtml(nomeCompleto)}</strong>
            <span>${escaparHtml(usuario.email || '')}</span>
        </div>
        <a href="meus-pedidos.html" class="user-dropdown-link">
            <i class="fa-solid fa-receipt"></i> Meus pedidos
        </a>
        <button type="button" class="user-dropdown-link user-dropdown-logout">
            <i class="fa-solid fa-right-from-bracket"></i> Sair
        </button>`;

    dropdown.querySelector('.user-dropdown-logout').addEventListener('click', sairDaConta);
    wrapper.appendChild(dropdown);

    document.addEventListener('click', function (e) {
        if (!wrapper.contains(e.target)) dropdown.classList.remove('open');
    });
}

function escaparHtml(texto) {
    return String(texto).replace(/[&<>"']/g, function (c) {
        return ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]);
    });
}

document.addEventListener('DOMContentLoaded', montarMenuUsuario);
