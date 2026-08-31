/*
 * CONFIGURAÇÃO DA FASE DO IMC
 * Você pode trocar todas as mensagens sem alterar a lógica abaixo.
 */
const CONFIGURACAO_IMC = {
    intervaloEntreMensagens: 2000,
    tempoAteOResultado: 8300,

    mensagensDeCarregamento: [
        "Consultando o Oscar... 12%",
        "Pesando decisões passadas... 38%",
        "Ligando para o guindaste... 74%",
        "Resultado gorduroso... 99%"
    ],

    mensagemSemDados: "⚠ ERRO: informe números para que possamos ignorá-los corretamente.",

    // Pode usar HTML nesta mensagem, como <strong>, <br> e <small>.
    resultadoFinal: `
        <strong>IMC: 60,00</strong>
        Obesidade grau 5: super-superobesidade afetiva.<br>
        <small>Os dados informados foram solenemente ignorados.</small>
    `
};

const campoPeso = document.querySelector("#peso");
const campoAltura = document.querySelector("#altura");
const caixaResultado = document.querySelector("#resultado");
const linkRecorrer = document.querySelector("#recorrer");
const botaoCalcular = document.querySelector("#calcular");

botaoCalcular.addEventListener("click", iniciarCalculoFalso);

function iniciarCalculoFalso() {
    if (campoPeso.value === "" || campoAltura.value === "") {
        mostrarErroDePreenchimento();
        return;
    }

    botaoCalcular.disabled = true;
    caixaResultado.hidden = false;

    mostrarMensagensDeCarregamento();

    setTimeout(mostrarResultadoFinal, CONFIGURACAO_IMC.tempoAteOResultado);
}

function mostrarErroDePreenchimento() {
    caixaResultado.hidden = false;
    caixaResultado.textContent = CONFIGURACAO_IMC.mensagemSemDados;
    linkRecorrer.hidden = true;
}

function mostrarMensagensDeCarregamento() {
    CONFIGURACAO_IMC.mensagensDeCarregamento.forEach((mensagem, indice) => {
        const tempoDaMensagem = CONFIGURACAO_IMC.intervaloEntreMensagens * indice;

        setTimeout(() => {
            caixaResultado.textContent = mensagem;
        }, tempoDaMensagem);
    });
}

function mostrarResultadoFinal() {
    caixaResultado.innerHTML = CONFIGURACAO_IMC.resultadoFinal;
    linkRecorrer.hidden = false;
    botaoCalcular.disabled = false;
    localStorage.setItem("pedrao_imc", "concluido");
}
