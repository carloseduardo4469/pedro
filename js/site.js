/*
 * CONFIGURAÇÃO GERAL
 * Mude os textos e a senha aqui. A lógica do site começa mais abaixo.
 */
const CONFIGURACAO = {
    senhaDaTerceiraFase: "sofiaceciroxo",
    quantidadeDeAvisos: 3,

    textos: {
        avisoDoBotao: "EU FALEI PARA NÃO CLICAR.",
        premioDoBotao: "Parabéns. Você desbloqueou absolutamente nada.",
        erroCaptcha: "Pense como o Pedrão e depois faça exatamente o contrário. Dicas: viagem e religião e aquoso ",
        erroSenha: "Senha errada. Isso foi uma Derrota. Dica: parente, BAIANA, cor (tem q ser td junto)"
    },

    // Nomes usados para salvar o progresso no navegador.
    progresso: {
        imc: "pedrao_imc",
        captcha: "pedrao_captcha",
        final: "pedrao_final"
    }
};

// Descobre em qual página estamos pelo atributo data-page do <body>.
const paginaAtual = document.body.dataset.page;

if (paginaAtual === "inicio") {
    document.addEventListener("DOMContentLoaded", prepararPuzzleInicial);
}

if (paginaAtual === "arquivo") {
    prepararFasesDoArquivo();
}

/* ================================================================
   PÁGINA INICIAL
   ================================================================ */

const CARTAS_DA_MEMORIA = [
    "IMG-20260830-WA0065.jpg",
    "IMG-20260830-WA0077.jpg",
    "IMG-20260831-WA0011.jpg",
    "IMG-20260831-WA0014.jpg",
    "IMG-20260831-WA0015.jpg",
    "IMG-20260831-WA0019.jpg",
    "IMG-20260831-WA0020.jpg",
    "unnamed.jpg"
];

const PERGUNTAS_DO_PUZZLE = [
    {
        pergunta: "Qual palavra representa o objetivo final desta investigação?",
        opcoes: ["DERROTA", "VITÓRIA", "EMPATE", "RECURSO"],
        correta: 1
    },
    {
        pergunta: "Como se chama o assistente emocional deste portal?",
        opcoes: ["PedrAI", "ChatDerrota", "OscarBot", "Robô Roxo"],
        correta: 0
    },
    {
        pergunta: "O IMC do site significa Índice de...",
        opcoes: ["Memória Curta", "Muitas Cartas", "Más Companhias", "Mérito Corporal"],
        correta: 2
    },
    {
        pergunta: "Qual objeto aparece como uma relíquia roxa no portal?",
        opcoes: ["Uma escova", "Um capacete", "Uma caneca", "Um teclado"],
        correta: 0
    },
    {
        pergunta: "Quantos pares você precisou encontrar no jogo da memória?",
        opcoes: ["4 pares", "6 pares", "8 pares", "16 pares"],
        correta: 2
    }
];

function prepararPuzzleInicial() {
    prepararJogoDaMemoria();
    prepararCarrossel();
}

function embaralhar(itens) {
    const copia = [...itens];

    for (let indice = copia.length - 1; indice > 0; indice -= 1) {
        const sorteado = Math.floor(Math.random() * (indice + 1));
        [copia[indice], copia[sorteado]] = [copia[sorteado], copia[indice]];
    }

    return copia;
}

function prepararJogoDaMemoria() {
    const tabuleiro = document.querySelector("#tabuleiroMemoria");
    const cartas = embaralhar([...CARTAS_DA_MEMORIA, ...CARTAS_DA_MEMORIA]);
    let primeiraCarta = null;
    let segundaCarta = null;
    let tabuleiroBloqueado = false;
    let pares = 0;
    let jogadas = 0;

    cartas.forEach((arquivo, indice) => {
        const carta = document.createElement("button");
        carta.className = "carta-memoria";
        carta.type = "button";
        carta.dataset.par = arquivo;
        carta.setAttribute("aria-label", `Virar carta ${indice + 1}`);
        carta.innerHTML = `<span class="carta-verso">?</span><span class="carta-frente"><img src="assets/${arquivo}" alt=""></span>`;
        carta.addEventListener("click", () => virarCarta(carta));
        tabuleiro.appendChild(carta);
    });

    function virarCarta(carta) {
        if (tabuleiroBloqueado || carta === primeiraCarta || carta.classList.contains("combinada")) return;

        carta.classList.add("virada");

        if (!primeiraCarta) {
            primeiraCarta = carta;
            return;
        }

        segundaCarta = carta;
        jogadas += 1;
        document.querySelector("#jogadas").textContent = jogadas;

        if (primeiraCarta.dataset.par === segundaCarta.dataset.par) {
            primeiraCarta.classList.add("combinada");
            segundaCarta.classList.add("combinada");
            pares += 1;
            document.querySelector("#paresEncontrados").textContent = `${pares}/8`;
            limparJogada();

            if (pares === CARTAS_DA_MEMORIA.length) {
                setTimeout(iniciarPerguntas, 700);
            }
            return;
        }

        tabuleiroBloqueado = true;
        setTimeout(() => {
            primeiraCarta.classList.remove("virada");
            segundaCarta.classList.remove("virada");
            limparJogada();
        }, 850);
    }

    function limparJogada() {
        primeiraCarta = null;
        segundaCarta = null;
        tabuleiroBloqueado = false;
    }
}

function iniciarPerguntas() {
    const telaMemoria = document.querySelector("#jogoMemoria");
    const telaPerguntas = document.querySelector("#telaPerguntas");
    let perguntaAtual = 0;

    telaMemoria.hidden = true;
    telaPerguntas.hidden = false;
    telaPerguntas.scrollIntoView({ behavior: "smooth" });
    mostrarPergunta();

    function mostrarPergunta() {
        const pergunta = PERGUNTAS_DO_PUZZLE[perguntaAtual];
        const opcoes = document.querySelector("#opcoesPergunta");
        document.querySelector("#numeroPergunta").textContent = `PERGUNTA ${perguntaAtual + 1}/5`;
        document.querySelector("#barraPerguntas").style.width = `${(perguntaAtual / PERGUNTAS_DO_PUZZLE.length) * 100}%`;
        document.querySelector("#textoPergunta").textContent = pergunta.pergunta;
        document.querySelector("#retornoPergunta").textContent = "";
        opcoes.innerHTML = "";

        pergunta.opcoes.forEach((texto, indice) => {
            const botao = document.createElement("button");
            botao.type = "button";
            botao.textContent = texto;
            botao.addEventListener("click", () => responder(indice, botao));
            opcoes.appendChild(botao);
        });
    }

    function responder(indice, botao) {
        const retorno = document.querySelector("#retornoPergunta");

        if (indice !== PERGUNTAS_DO_PUZZLE[perguntaAtual].correta) {
            botao.classList.add("errada");
            retorno.textContent = "DERROTA! Essa não é a resposta. Tente novamente.";
            return;
        }

        botao.classList.add("correta");
        retorno.textContent = "VITÓRIA! Próxima pergunta...";
        document.querySelectorAll("#opcoesPergunta button").forEach((opcao) => { opcao.disabled = true; });
        perguntaAtual += 1;
        document.querySelector("#barraPerguntas").style.width = `${(perguntaAtual / PERGUNTAS_DO_PUZZLE.length) * 100}%`;

        setTimeout(() => {
            if (perguntaAtual === PERGUNTAS_DO_PUZZLE.length) {
                telaPerguntas.hidden = true;
                document.querySelector("#telaVitoriaPuzzle").hidden = false;
                document.querySelector("#telaVitoriaPuzzle").scrollIntoView({ behavior: "smooth" });
                return;
            }
            mostrarPergunta();
        }, 750);
    }
}

function prepararCarrossel() {
    const fotos = [...document.querySelectorAll(".foto-carrossel")];
    const indicadores = document.querySelector("#indicadoresCarrossel");
    let fotoAtual = 0;

    fotos.forEach((_, indice) => {
        const indicador = document.createElement("button");
        indicador.type = "button";
        indicador.setAttribute("aria-label", `Mostrar foto ${indice + 1}`);
        indicador.addEventListener("click", () => mostrarFoto(indice));
        indicadores.appendChild(indicador);
    });

    function mostrarFoto(indice) {
        fotoAtual = (indice + fotos.length) % fotos.length;
        fotos.forEach((foto, posicao) => foto.classList.toggle("ativa", posicao === fotoAtual));
        [...indicadores.children].forEach((item, posicao) => item.classList.toggle("ativo", posicao === fotoAtual));
        document.querySelector("#contadorCarrossel").textContent = `${fotoAtual + 1} / ${fotos.length}`;
    }

    document.querySelector("#fotoAnterior").addEventListener("click", () => mostrarFoto(fotoAtual - 1));
    document.querySelector("#proximaFoto").addEventListener("click", () => mostrarFoto(fotoAtual + 1));
    document.querySelector("#reiniciarPuzzle").addEventListener("click", () => location.reload());
    mostrarFoto(0);
}

function prepararBotaoProibido() {
    const botao = document.querySelector("#naoClique");
    const aviso = document.querySelector("#avisoSecreto");
    let numeroDeCliques = 0;

    botao.addEventListener("click", () => {
        numeroDeCliques += 1;
        aviso.hidden = false;

        if (numeroDeCliques < CONFIGURACAO.quantidadeDeAvisos) {
            aviso.textContent = `${CONFIGURACAO.textos.avisoDoBotao} Advertência ${numeroDeCliques}/${CONFIGURACAO.quantidadeDeAvisos}.`;
        } else {
            aviso.textContent = CONFIGURACAO.textos.premioDoBotao;
        }

        moverBotaoAleatoriamente(botao);
    });
}

function moverBotaoAleatoriamente(botao) {
    const movimentoHorizontal = Math.random() * 80 - 40;
    const movimentoVertical = Math.random() * 35 - 17;
    const rotacao = Math.random() * 20 - 10;

    botao.style.transform = `translate(${movimentoHorizontal}px, ${movimentoVertical}px) rotate(${rotacao}deg)`;
}

/* ================================================================
   FASES 2 E 3: CAPTCHA E COFRE
   ================================================================ */

function prepararFasesDoArquivo() {
    const elementos = pegarElementosDoArquivo();

    prepararOpcoesDoCaptcha(elementos);
    prepararBotoesDoCofre(elementos);
    restaurarProgresso(elementos);
    prepararFotosDVD();
    prepararBotaoDeReinicio();
}

function prepararFotosDVD() {
    const pista = document.querySelector(".fotos-dvd");

    if (!pista) return;

    const fotos = [...pista.querySelectorAll("img")];
    const movimentos = fotos.map((foto, indice) => ({
        foto,
        x: 15 + (indice * 97) % 500,
        y: 20 + (indice * 71) % 300,
        velocidadeX: (indice % 2 ? -1 : 1) * (70 + indice * 8),
        velocidadeY: (indice % 3 ? 1 : -1) * (62 + indice * 7)
    }));
    let instanteAnterior;

    function animar(instanteAtual) {
        const intervalo = Math.min((instanteAtual - (instanteAnterior ?? instanteAtual)) / 1000, 0.04);
        instanteAnterior = instanteAtual;
        const larguraMaxima = pista.clientWidth;
        const alturaMaxima = pista.clientHeight;

        movimentos.forEach((movimento) => {
            const limiteX = Math.max(0, larguraMaxima - movimento.foto.offsetWidth);
            const limiteY = Math.max(0, alturaMaxima - movimento.foto.offsetHeight);

            movimento.x += movimento.velocidadeX * intervalo;
            movimento.y += movimento.velocidadeY * intervalo;

            if (movimento.x <= 0 || movimento.x >= limiteX) {
                movimento.x = Math.max(0, Math.min(movimento.x, limiteX));
                movimento.velocidadeX *= -1;
            }

            if (movimento.y <= 0 || movimento.y >= limiteY) {
                movimento.y = Math.max(0, Math.min(movimento.y, limiteY));
                movimento.velocidadeY *= -1;
            }

            movimento.foto.style.transform = `translate3d(${movimento.x}px, ${movimento.y}px, 0)`;
        });

        requestAnimationFrame(animar);
    }

    requestAnimationFrame(animar);
}

function pegarElementosDoArquivo() {
    return {
        opcoesCaptcha: [...document.querySelectorAll(".grade-captcha button")],
        botaoVerificar: document.querySelector("#verificar"),
        erroCaptcha: document.querySelector("#erroCaptcha"),
        secaoCaptcha: document.querySelector("#captcha"),
        secaoCofre: document.querySelector("#cofre"),
        secaoPremio: document.querySelector("#premio"),
        campoSenha: document.querySelector("#senha"),
        botaoAbrirCofre: document.querySelector("#abrirCofre"),
        erroSenha: document.querySelector("#erroSenha")
    };
}

function prepararOpcoesDoCaptcha(elementos) {
    elementos.opcoesCaptcha.forEach((opcao) => {
        opcao.addEventListener("click", () => {
            opcao.classList.toggle("selecionado");
        });
    });

    elementos.botaoVerificar.addEventListener("click", () => {
        verificarCaptcha(elementos);
    });
}

function verificarCaptcha(elementos) {
    const acertouTudo = elementos.opcoesCaptcha.every((opcao) => {
        const foiSelecionada = opcao.classList.contains("selecionado");
        const deveriaSerSelecionada = opcao.dataset.ruim === "true";

        return foiSelecionada === deveriaSerSelecionada;
    });

    if (!acertouTudo) {
        elementos.erroCaptcha.textContent = CONFIGURACAO.textos.erroCaptcha;
        return;
    }

    localStorage.setItem(CONFIGURACAO.progresso.captcha, "concluido");
    mostrarSomente(elementos.secaoCofre, elementos.secaoCaptcha);
}

function prepararBotoesDoCofre(elementos) {
    elementos.botaoAbrirCofre.addEventListener("click", () => {
        verificarSenha(elementos);
    });

    elementos.campoSenha.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter") {
            verificarSenha(elementos);
        }
    });
}

function verificarSenha(elementos) {
    const senhaDigitada = normalizarTexto(elementos.campoSenha.value);
    const senhaCorreta = normalizarTexto(CONFIGURACAO.senhaDaTerceiraFase);

    if (senhaDigitada !== senhaCorreta) {
        elementos.erroSenha.textContent = CONFIGURACAO.textos.erroSenha;
        return;
    }

    localStorage.setItem(CONFIGURACAO.progresso.final, "concluido");
    mostrarSomente(elementos.secaoPremio, elementos.secaoCofre);
}

// Permite escrever VITORIA, Vitória, vitória etc.
function normalizarTexto(texto) {
    return texto
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();
}

function mostrarSomente(secaoParaMostrar, secaoParaEsconder) {
    secaoParaEsconder.hidden = true;
    secaoParaMostrar.hidden = false;
    secaoParaMostrar.scrollIntoView({ behavior: "smooth" });
}

function restaurarProgresso(elementos) {
    if (localStorage.getItem(CONFIGURACAO.progresso.final)) {
        elementos.secaoCaptcha.hidden = true;
        elementos.secaoPremio.hidden = false;
        return;
    }

    if (localStorage.getItem(CONFIGURACAO.progresso.captcha)) {
        elementos.secaoCaptcha.hidden = true;
        elementos.secaoCofre.hidden = false;
    }
}

function prepararBotaoDeReinicio() {
    document.querySelector("#reiniciar").addEventListener("click", () => {
        Object.values(CONFIGURACAO.progresso).forEach((chave) => {
            localStorage.removeItem(chave);
        });

        location.reload();
    });
}
