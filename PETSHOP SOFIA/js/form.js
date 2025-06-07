// ===================== FORMULÁRIO DE MARCAÇÃO =====================
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-marcacao');
  const mensagem = document.getElementById('mensagem');
  const servicoSelect = document.getElementById('servico');
  const hotelDates = document.getElementById('hotel-dates');
  const normalDate = document.getElementById('normal-date');
  const animalSelect = document.getElementById('animal');
  const speciesContainer = document.getElementById('species-container');
  const speciesInput = document.getElementById('species');
  const dataInput = document.getElementById('data');
  const dataEntrada = document.getElementById('data-entrada');
  const dataSaida = document.getElementById('data-saida');
  const horaInput = document.getElementById('hora');
  const horaErro = document.getElementById('hora-erro');
  const contactoInput = form ? form.contacto : null;
  const contactoErro = document.getElementById('contacto-erro');

  // Popup modal elements
  const popupModal = document.getElementById('popup-modal');
  const popupMessage = document.getElementById('popup-message');
  const popupClose = document.getElementById('popup-close');

  // --- Validação do formulário ---
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (contactoInput && contactoErro && !/^\d{9}$/.test(contactoInput.value)) {
        contactoErro.textContent = 'O contacto deve conter 9 dígitos.';
        contactoErro.style.display = 'inline';
        mensagem.textContent = '';
        return;
      } else if (contactoErro) {
        contactoErro.textContent = '';
        contactoErro.style.display = 'none';
      }
      mensagem.textContent = '';
      const dados = {
        nome: form.nome.value,
        animal: form.animal.value,
        servico: form.servico.value,
        data: form.data.value,
        hora: form.hora.value,
        contacto: form.contacto.value,
        email: form.email.value,
        observacoes: form.observacoes.value,
        data_entrada: servicoSelect.value === 'Hotel' && dataEntrada ? dataEntrada.value : null,
        data_saida: servicoSelect.value === 'Hotel' && dataSaida ? dataSaida.value : null
      };
      try {
        const resposta = await fetch('/api/marcacoes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados),
        });
        await resposta.json();
        const appointmentId = Math.floor(Math.random() * 1000000);
        if (popupModal && popupMessage) {
  popupMessage.textContent = `A sua marcação foi concluída com sucesso! O seu ID de marcação é: ${appointmentId}`;
  popupModal.style.display = 'flex';
} else {
  console.error('popupModal or popupMessage not found!');
}
        form.reset();
      } catch {
        mensagem.textContent = 'Erro ao enviar marcação. Tente novamente.';
        mensagem.style.color = 'red';
      }
    });
  }
if (popupClose && popupModal) {
    popupClose.addEventListener('click', () => {
      popupModal.style.display = 'none';
    });
    popupModal.addEventListener('click', (e) => {
      if (e.target === popupModal) popupModal.style.display = 'none';
    });
  }
// Show popup
popupModal.classList.add('flex');
// Hide popup
popupModal.classList.remove('flex');



  // --- Validação Contacto em tempo real ---
  if (contactoInput && contactoErro) {
    contactoInput.addEventListener('input', () => {
      if (!/^\d{9}$/.test(contactoInput.value)) {
        contactoErro.textContent = 'O contacto deve conter 9 dígitos.';
        contactoErro.style.display = 'inline';
      } else {
        contactoErro.textContent = '';
        contactoErro.style.display = 'none';
      }
    });
  }

  // --- Mostrar campo espécie se "Outros" ---
  function toggleSpeciesTextbox() {
    if (animalSelect && speciesContainer && speciesInput) {
      if (animalSelect.value === 'Outros') {
        speciesContainer.style.display = 'block';
        speciesInput.setAttribute('required', 'required');
      } else {
        speciesContainer.style.display = 'none';
        speciesInput.removeAttribute('required');
      }
    }
  }
  if (animalSelect) {
    animalSelect.addEventListener('change', toggleSpeciesTextbox);
    toggleSpeciesTextbox();
  }

  // --- Datas Hotel ---
  function toggleHotelDates() {
    if (servicoSelect && hotelDates && normalDate) {
      if (servicoSelect.value === 'Hotel') {
        hotelDates.style.display = 'block';
        normalDate.style.display = 'none';
        if (dataEntrada) dataEntrada.required = true;
        if (dataSaida) dataSaida.required = true;
        if (dataInput) dataInput.required = false;
      } else {
        hotelDates.style.display = 'none';
        normalDate.style.display = 'block';
        if (dataInput) dataInput.required = true;
        if (dataEntrada) dataEntrada.required = false;
        if (dataSaida) dataSaida.required = false;
      }
    }
  }
  if (servicoSelect) {
    servicoSelect.addEventListener('change', toggleHotelDates);
    toggleHotelDates();
  }

  // --- Data mínima ---
  const today = new Date().toISOString().split('T')[0];
  if (dataInput) dataInput.setAttribute('min', today);
  if (dataEntrada) {
    dataEntrada.setAttribute('min', today);
    dataEntrada.addEventListener('change', function () {
      if (dataSaida) {
        dataSaida.value = '';
        dataSaida.setAttribute('min', dataEntrada.value);
      }
    });
  }
  if (dataSaida && dataEntrada) {
    dataSaida.addEventListener('change', function () {
      if (dataSaida.value < dataEntrada.value) {
        dataSaida.value = dataEntrada.value;
      }
    });
  }

  // --- Validação Hora ---
  if (horaInput && horaErro) {
    horaInput.addEventListener('input', () => {
      const horaSelecionada = horaInput.value;
      horaErro.style.display = (horaSelecionada < "08:00" || horaSelecionada > "20:00") ? "block" : "none";
    });
  }
});