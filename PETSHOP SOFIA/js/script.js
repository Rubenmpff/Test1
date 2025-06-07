// ===================== DARK MODE, SWIPER, TABS, HELP POPUP =====================
document.addEventListener('DOMContentLoaded', () => {
  // DARK MODE
  const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');
  function applyTheme(isDarkMode) {
    document.body.classList.toggle('dark', isDarkMode);
    document.body.classList.toggle('dark-mode', isDarkMode);
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    if (header) header.classList.toggle('dark', isDarkMode);
    if (footer) footer.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
  }
  if (themeToggleCheckbox) {
    themeToggleCheckbox.addEventListener('change', () => {
      applyTheme(themeToggleCheckbox.checked);
    });
    const savedMode = localStorage.getItem('darkMode') === 'true';
    themeToggleCheckbox.checked = savedMode;
    applyTheme(savedMode);
  }

  // SWIPER CARROSSEL
  if (window.Swiper) {
    new Swiper('.swiper', {
      loop: true,
      autoplay: { delay: 3500, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    });
    new Swiper('.servicos-swiper', {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 20,
      autoplay: { delay: 3500, disableOnInteraction: false },
      navigation: {
        nextEl: '.servicos-swiper .swiper-button-next',
        prevEl: '.servicos-swiper .swiper-button-prev',
      },
      pagination: { el: '.servicos-swiper .swiper-pagination', clickable: true }
    });
  }

  // TABS
  window.abrirTab = function(tab) {
    document.querySelectorAll('.tab-content').forEach(div => {
      div.style.display = 'none';
    });
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const tabDiv = document.getElementById('tab-' + tab);
    if (tabDiv) tabDiv.style.display = 'block';
    document.querySelectorAll('.tab-btn').forEach(btn => {
      if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes("'" + tab + "'")) {
        btn.classList.add('active');
      }
    });
  };

  // HELP POPUP ON LOAD
  const helpPopup = document.getElementById('help-popup');
  const helpPopupClose = document.getElementById('help-popup-close');
  if (helpPopup && helpPopupClose) {
    helpPopup.style.display = 'block';
    helpPopupClose.addEventListener('click', () => {
      helpPopup.style.display = 'none';
    });
  }
});

// ===================== CHATBOT =====================
const chatbotBtn = document.getElementById('chatbot-button');
const chatbotPopup = document.getElementById('chatbot-popup');
const sendBtn = document.getElementById('chatbot-send');
const inputField = document.getElementById('chatbot-input');
const messageBox = document.getElementById('chatbot-messages');

let step = 0;
let chatStarted = false;

chatbotBtn.addEventListener('click', () => {
  chatbotPopup.classList.toggle('show');
  const helpPopup = document.getElementById('help-popup');
  if (helpPopup) helpPopup.style.display = 'none';
  if (!chatStarted && chatbotPopup.classList.contains('show')) {
    setTimeout(() => {
      appendMessage('Petshop', 'Olá! Como podemos ajudar?');
      chatStarted = true;
    }, 300);
  }
});

sendBtn.addEventListener('click', () => {
  const userText = inputField.value.trim();
  if (userText) {
    appendMessage('Utilizador', userText);
    inputField.value = '';
    if (step === 0) {
      setTimeout(() => {
        appendMessage('Petshop', 'Qual é o seu nome?');
        step++;
      }, 500);
    } else if (step === 1) {
      setTimeout(() => {
        appendMessage('Petshop', 'Obrigado. Um assistente irá atendê-lo em breve.');
        step++;
      }, 500);
    } else {
      setTimeout(() => {
        appendMessage('Petshop', 'Por favor, aguarde por um assistente.');
      }, 500);
    }
  }
});
inputField.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendBtn.click();
  }
});
function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  messageBox.appendChild(msg);
  messageBox.scrollTop = messageBox.scrollHeight;
}