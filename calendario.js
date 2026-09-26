// Pegando os elementos do HTML
const daysTag = document.querySelector(".days"),
currentDate = document.querySelector(".current-date"),
prevNextIcon = document.querySelectorAll(".icons span");

// Data atual (dia, mês, ano de hoje)
let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();

// Guarda o dia que o usuário clicou (começa vazio)
let selectedDate = null;

// Nomes dos meses em português
const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
              "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

// Desenha o calendário inteiro
const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // dia da semana em que o mês começa
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // último dia do mês atual
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // dia da semana em que o mês termina
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // último dia do mês anterior
    let liTag = "";

    // dias cinza do mês anterior (preenchendo o início da grade)
    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    // dias do mês atual
    for (let i = 1; i <= lastDateofMonth; i++) {
        // é o dia de hoje?
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
                     && currYear === new Date().getFullYear() ? "active" : "";

        // é o dia selecionado pelo usuário?
        let isSelected = selectedDate && 
                        i === selectedDate.day && 
                        currMonth === selectedDate.month && 
                        currYear === selectedDate.year ? "selected" : "";

        liTag += `<li class="${isToday} ${isSelected}">${i}</li>`;
    }

    // dias cinza do próximo mês (preenchendo o final da grade)
    for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
    }

    currentDate.innerText = `${months[currMonth]} ${currYear}`; // escreve "Mês Ano" no topo
    daysTag.innerHTML = liTag; // insere todos os dias na tela

    addClickToDays(); // religa os cliques nos dias (foram recriados agora)
}

// Escuta o clique em cada dia do mês atual
function addClickToDays(){
    const allDays = document.querySelectorAll(".days li:not(.inactive)");

    allDays.forEach((day, index) => {
        day.addEventListener("click", () => {
            // guarda o dia clicado
            selectedDate = {
                day: index + 1,
                month: currMonth,
                year: currYear
            };
            renderCalendar(); // redesenha com o dia marcado
        });
    });
}

renderCalendar(); // desenha o calendário assim que a página carrega

// Botões de trocar de mês (< e >)
prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        // "prev" volta um mês, "next" avança um mês
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        // se passou de Dezembro ou voltou antes de Janeiro, ajusta o ano
        if(currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        } else {
            date = new Date();
        }
        renderCalendar();
    });
});

//marcar o horario na agenda

const botoesHorario = document.querySelectorAll(".btn_horario");

botoesHorario.forEach(botao => {
    botao.addEventListener("click", () => {
        // tira o "selected" de TODOS os botões primeiro
        botoesHorario.forEach(b => b.classList.remove("selected"));

        // aí adiciona só no que foi clicado
        botao.classList.add("selected");
        
    });
});