document.addEventListener('DOMContentLoaded', function () {
    const box = document.getElementById('confirmSummary');
    if (!box) return;

    let pedido = null;
    try {
        pedido = JSON.parse(sessionStorage.getItem('ultimoPedidoConfirmado'));
    } catch {
        pedido = null;
    }

    if (!pedido) {
        box.style.display = 'none';
        return;
    }

    const formatar = function (valor) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
    };

    box.innerHTML = `
        <div><span>Número do pedido</span><strong>#${pedido.idPedido}</strong></div>
        <div><span>Pagamento</span><strong>${rotuloPagamento(pedido.formaPagamento)}</strong></div>
        <div><span>Subtotal</span><strong>${formatar(pedido.subtotal)}</strong></div>
        <div><span>Frete</span><strong>${formatar(pedido.frete)}</strong></div>
        <div><span>Total</span><strong>${formatar(pedido.total)}</strong></div>`;
});

function rotuloPagamento(forma) {
    const nomes = {
        pix: 'Pix',
        cartao: 'Cartão',
        pagar_na_entrega: 'Pagar na entrega'
    };
    return nomes[forma] || forma;
}
