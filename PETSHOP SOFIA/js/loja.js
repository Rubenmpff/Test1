// ===================== PESQUISA PRODUTOS =====================
document.addEventListener('DOMContentLoaded', () => {
  function filtrarProdutos() {
    const termo = document.getElementById('busca-produto').value.toLowerCase();
    document.querySelectorAll('.tab-content').forEach(tab => {
      if (tab.style.display !== 'none') {
        const lista = tab.querySelector('.produtos-lista');
        let algumVisivel = false;

        lista.querySelectorAll('li:not(.aviso-nenhum-produto)').forEach(li => {
          const nome = li.querySelector('.produto-nome').textContent.toLowerCase();
          if (nome.includes(termo)) {
            li.style.display = '';
            algumVisivel = true;
          } else {
            li.style.display = 'none';
          }
        });

        let aviso = lista.querySelector('.aviso-nenhum-produto');
        if (!algumVisivel) {
          if (!aviso) {
            aviso = document.createElement('li');
            aviso.className = 'aviso-nenhum-produto';
            aviso.textContent = 'Não existem produtos disponíveis.';
            lista.appendChild(aviso);
          }
          aviso.style.display = '';
        } else if (aviso) {
          aviso.style.display = 'none';
        }
      }
    });
  }
  window.filtrarProdutos = filtrarProdutos;
});

// ===================== CHECKOUT RESUMO =====================
document.addEventListener('DOMContentLoaded', () => {
  // Só executa se estiver na página de checkout
  const ul = document.getElementById('checkout-items');
  const totalDiv = document.getElementById('checkout-total');
  if (ul && totalDiv) {
    const items = JSON.parse(localStorage.getItem('cart')) || [];

    let total = 0;

    ul.innerHTML = '';

    if (items.length === 0) {
      ul.innerHTML = '<li>O seu carrinho está vazio.</li>';
      totalDiv.textContent = '';
    } else {
      items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.nome} - € ${item.preco.toFixed(2)}`;
        ul.appendChild(li);
        total += item.preco;
      });
      totalDiv.textContent = `Total: € ${total.toFixed(2)}`;
    }
  }
});