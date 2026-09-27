function saudacaoPorHorario() {
  const hora = new Date().getHours();

  if (hora >= 5 && hora < 12) {
    return 'Bom dia';
  } else if (hora >= 12 && hora < 18) {
    return 'Boa tarde';
  } else {
    return 'Boa noite';
  }
}

function obterDataAtualFormatada() {
  const agora = new Date();
  const opcoes = { weekday: 'long', day: 'numeric', month: 'long' };
  let dataExtenso = agora.toLocaleDateString('pt-BR', opcoes); 
  return dataExtenso.replace(/(^\w|\b\w)/g, letra => letra.toUpperCase());
}

document.addEventListener('DOMContentLoaded', () => {
  const titulo = document.querySelector('.section__main h2');
  if (titulo) {
    titulo.textContent = `${saudacaoPorHorario()}, Milene!`;
  }

  const subtituloData = document.querySelector('.data-subtitulo');
  if (subtituloData) {
    subtituloData.textContent = obterDataAtualFormatada();
  }
});