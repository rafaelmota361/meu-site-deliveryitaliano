const API_PEDIDOS_LISTA_URL = `${window.location.origin}/api/pedidos`;

function escaparTexto(texto) {
    return String(texto ?? '').replace(/[&<>"']/g, function (c) {
        return ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]);
    });
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
}

function formatarData(iso) {
    const data = new Date(iso);
    if (isNaN(data)) return '';
    return data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

function rotuloPagamentoPedido(forma) {
    const nomes = { pix: 'Pix', cartao: 'Cartão', pagar_na_entrega: 'Pagar na entrega' };
    return nomes[forma] || forma;
}

function rotuloStatus(status) {
    const nomes = {
        recebido: 'Recebido',
        em_preparo: 'Em preparo',
        saiu_para_entrega: 'Saiu para entrega',
        entregue: 'Entregue',
        cancelado: 'Cancelado'
    };
    return nomes[status] || status;
}

function renderMensagem(texto) {
    const lista = document.getElementById('ordersList');
    if (lista) lista.innerHTML = `<div class="orders-empty">${escaparTexto(texto)}</div>`;
}

function renderPedidos(pedidos) {
    const lista = document.getElementById('ordersList');
    if (!lista) return;

    if (!pedidos || pedidos.length === 0) {
        renderMensagem('Nenhum pedido realizado até agora.');
        return;
    }

    lista.innerHTML = pedidos.map(function (p) {
        const linhas = p.itens.map(function (i) {
            return `
            <tr>
                <td>${escaparTexto(i.nome)}</td>
                <td>${i.quantidade}x</td>
                <td>${formatarMoeda(i.precoUnitario * i.quantidade)}</td>
            </tr>`;
        }).join('');

        return `
        <div class="order-card">
            <div class="order-card-header">
                <div>
                    <strong>Pedido #${p.idPedido}</strong><br>
                    <span>${escaparTexto(formatarData(p.criadoEm))} · ${escaparTexto(rotuloPagamentoPedido(p.formaPagamento))}</span>
                </div>
                <span class="order-status">${escaparTexto(rotuloStatus(p.status))}</span>
            </div>
            <table class="order-items">
                <thead>
                    <tr><th>Prato</th><th>Qtd</th><th>Preço</th></tr>
                </thead>
                <tbody>${linhas}</tbody>
            </table>
            <div class="order-total"><span>Frete</span><span>${formatarMoeda(p.frete)}</span></div>
            <div class="order-total"><span>Total</span><span>${formatarMoeda(p.total)}</span></div>
        </div>`;
    }).join('');
}

document.addEventListener('DOMContentLoaded', async function () {
    let usuario = null;
    try {
        usuario = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    } catch {
        usuario = null;
    }

    const idUsuario = usuario && (usuario.id || usuario.idUsuario);
    if (!idUsuario) {
        renderMensagem('Faça login para ver seus pedidos.');
        return;
    }

    try {
        const response = await fetch(`${API_PEDIDOS_LISTA_URL}?idUsuario=${idUsuario}`);
        if (!response.ok) {
            renderMensagem('Não foi possível carregar seus pedidos agora.');
            return;
        }
        renderPedidos(await response.json());
    } catch {
        renderMensagem('Não foi possível conectar ao servidor para carregar seus pedidos.');
    }
});
