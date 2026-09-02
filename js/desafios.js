const paginaDoDesafio = document.body.dataset.page;
if (paginaDoDesafio === "memoria") prepararMemoria();
if (paginaDoDesafio === "perguntas") prepararPerguntas();
if (paginaDoDesafio === "vitoria-puzzle") prepararCarrosselDaVitoria();

function prepararMemoria() {
    const tabuleiro = document.querySelector("#tabuleiroMemoria");
    const cartas = [...tabuleiro.querySelectorAll(".carta-memoria")];
    let primeira = null, segunda = null, bloqueado = false, pares = 0, jogadas = 0;
    cartas.sort(() => Math.random() - .5).forEach((carta) => tabuleiro.appendChild(carta));
    cartas.forEach((carta) => carta.addEventListener("click", () => {
        if (bloqueado || carta === primeira || carta.classList.contains("combinada")) return;
        carta.classList.add("virada");
        if (!primeira) { primeira = carta; return; }
        segunda = carta;
        document.querySelector("#jogadas").textContent = ++jogadas;
        if (primeira.dataset.par === segunda.dataset.par) {
            primeira.classList.add("combinada"); segunda.classList.add("combinada");
            document.querySelector("#paresEncontrados").textContent = `${++pares}/8`;
            limpar();
            if (pares === 8) setTimeout(() => { location.href = "perguntas.html"; }, 700);
        } else {
            bloqueado = true;
            setTimeout(() => { primeira.classList.remove("virada"); segunda.classList.remove("virada"); limpar(); }, 850);
        }
    }));
    function limpar() { primeira = null; segunda = null; bloqueado = false; }
}

function prepararPerguntas() {
    const perguntas = [...document.querySelectorAll(".pergunta-puzzle")];
    const retorno = document.querySelector("#retornoPergunta");
    perguntas.forEach((pergunta, indice) => pergunta.querySelectorAll("button").forEach((botao) => botao.addEventListener("click", () => {
        if (!botao.hasAttribute("data-correta")) { botao.classList.add("errada"); retorno.textContent = "DERROTA! Tente novamente."; return; }
        botao.classList.add("correta");
        pergunta.querySelectorAll("button").forEach((opcao) => { opcao.disabled = true; });
        retorno.textContent = "VITÓRIA! Próxima pergunta...";
        const proxima = indice + 1;
        document.querySelector("#barraPerguntas").style.width = `${(proxima / perguntas.length) * 100}%`;
        setTimeout(() => {
            if (proxima === perguntas.length) { location.href = "vitoria.html"; return; }
            pergunta.classList.remove("ativa"); perguntas[proxima].classList.add("ativa");
            document.querySelector("#numeroPergunta").textContent = `PERGUNTA ${proxima + 1}/5`;
            retorno.textContent = "";
        }, 700);
    })));
}

function prepararCarrosselDaVitoria() {
    const fotos = [...document.querySelectorAll(".foto-carrossel")];
    const indicadores = document.querySelector("#indicadoresCarrossel");
    let atual = 0;
    fotos.forEach((_, indice) => {
        const botao = document.createElement("button"); botao.type = "button";
        botao.setAttribute("aria-label", `Mostrar foto ${indice + 1}`);
        botao.addEventListener("click", () => mostrar(indice)); indicadores.appendChild(botao);
    });
    function mostrar(indice) {
        atual = (indice + fotos.length) % fotos.length;
        fotos.forEach((foto, posicao) => foto.classList.toggle("ativa", posicao === atual));
        [...indicadores.children].forEach((item, posicao) => item.classList.toggle("ativo", posicao === atual));
        document.querySelector("#contadorCarrossel").textContent = `${atual + 1} / ${fotos.length}`;
    }
    document.querySelector("#fotoAnterior").addEventListener("click", () => mostrar(atual - 1));
    document.querySelector("#proximaFoto").addEventListener("click", () => mostrar(atual + 1));
    mostrar(0);
}
