// ===================== CARRINHO =====================

// Util functions for cart
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function clearCart() {
  localStorage.removeItem('cart');
}

function groupCartItems(cart) {
  const grouped = {};
  cart.forEach(item => {
    if (!grouped[item.nome]) {
      grouped[item.nome] = { ...item, quantidade: item.quantidade || 1 };
    } else {
      grouped[item.nome].quantidade += item.quantidade || 1;
    }
  });
  return Object.values(grouped);
}

// Atualiza o carrinho na UI
function atualizarCarrinho() {
  const cart = getCart();
  const cartItemsUl = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const totalSpan = document.getElementById('checkout-total');
  let total = 0;

  const totalQuantidade = cart.reduce((sum, item) => sum + (item.quantidade || 1), 0);
  if (cartCount) cartCount.textContent = totalQuantidade;

  cartItemsUl.innerHTML = '';
  if (cart.length === 0) {
    cartItemsUl.innerHTML = '<li>Carrinho vazio.</li>';
    if (totalSpan) totalSpan.textContent = 'Total: 0€';
    return;
  }

  const grouped = groupCartItems(cart);
  grouped.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.nome} (x${item.quantidade}) - €${(item.preco * item.quantidade).toFixed(2)}`;
    cartItemsUl.appendChild(li);
    total += item.preco * item.quantidade;
  });

  if (totalSpan) totalSpan.textContent = `Total: ${total.toFixed(2)}€`;
}

// Adiciona produto ao carrinho
function adicionarAoCarrinho(produto) {
  const cart = getCart();
  const found = cart.find(item => item.nome === produto.nome);
  if (found) {
    found.quantidade = (found.quantidade || 1) + 1;
  } else {
    produto.quantidade = 1;
    cart.push(produto);
  }
  saveCart(cart);
  atualizarCarrinho();
}

// Limpa o carrinho
function _clearCartStorage() {
  localStorage.removeItem('cart');
}

// Limpa o carrinho
window.clearCart = function() {
  _clearCartStorage();
  atualizarCarrinho();
};



// Alterna dropdown do carrinho
window.toggleCart = function() {
  const dropdown = document.getElementById('cart-dropdown');
  dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
};

// Eventos globais
document.addEventListener('DOMContentLoaded', function() {
  // Botões de adicionar ao carrinho
  document.querySelectorAll('.btn-carrinho').forEach(btn => {
    btn.addEventListener('click', function() {
      const produto = {
        nome: this.parentElement.querySelector('.produto-nome').textContent.trim(),
        preco: Number(this.parentElement.getAttribute('data-valor'))
      };
      adicionarAoCarrinho(produto);
    });
  });



  // Botão voltar loja
  const btnVoltarLoja = document.getElementById('voltar-loja');
  if (btnVoltarLoja) {
    btnVoltarLoja.addEventListener('click', function() {
      window.location.href = 'loja.html';
    });
  }

  atualizarCarrinho();
});

// Fecha dropdown do carrinho ao clicar fora
if (window.location.pathname.includes('checkout.html')) {
  document.addEventListener('DOMContentLoaded', function() {
    atualizarCarrinho();

    // Formulário de checkout
    document.querySelector('.checkout-form').addEventListener('submit', function(e) {
      if (!this.checkValidity()) {
        e.preventDefault();
        this.reportValidity();
        return;
      }
      // If valid, prevent default and show modal
      e.preventDefault();
      window.fazerCheckout();
    });

    // Botão voltar para início
    const btnReturnHome = document.getElementById('return-home');
    if (btnReturnHome) {
      btnReturnHome.onclick = function() {
        window.location.href = 'inicio.html';
      };
    }

    // Botão voltar loja (checkout)
    const btnVoltarLoja = document.getElementById('voltar-loja');
    if (btnVoltarLoja) {
      btnVoltarLoja.onclick = function() {
        window.location.href = 'loja.html';
      };
    }
  });
}

window.fazerCheckout = function() {
  // Show modal instead of redirect
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.style.display = 'block';

  // Optional: clear cart after checkout
  _clearCartStorage();
  atualizarCarrinho();
};
// Modal close logic
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('checkout-modal');
  const closeBtn = document.getElementById('close-modal');
  const returnHomeBtn = document.getElementById('modal-return-home');
  if (closeBtn && modal) {
    closeBtn.onclick = function() { modal.style.display = 'none'; };
  }
  if (returnHomeBtn) {
    returnHomeBtn.onclick = function() {
      window.location.href = 'inicio.html';
    };
  }});