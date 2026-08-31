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
    prepararBotaoProibido();
}

if (paginaAtual === "arquivo") {
    prepararFasesDoArquivo();
}

/* ================================================================
   PÁGINA INICIAL
   ================================================================ */

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
    prepararBotaoDeReinicio();
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
