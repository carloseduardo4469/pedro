# Guia rápido para editar o site

O site está dividido assim:

- `index.html`: página inicial e seus textos.
- `imc.html`: campos e botões da fase 1.
- `edits.html`: CAPTCHA, cofre, certificado e vídeos.
- `css/style.css`: cores, tamanhos, posições e aparência.
- `js/imc.js`: mensagens e funcionamento do IMC falso.
- `js/site.js`: botão proibido, CAPTCHA, senha e progresso.
- `assets/`: imagens e vídeos.

## Trocar a senha da terceira fase

Abra `js/site.js` e altere esta linha no objeto `CONFIGURACAO`:

```js
senhaDaTerceiraFase: "VITORIA",
```

## Trocar as respostas certas do CAPTCHA

Abra `edits.html`. Cada alternativa possui `data-ruim`:

```html
<button data-ruim="true">Resposta certa</button>
<button data-ruim="false">Resposta errada</button>
```

- `true`: precisa ser marcada.
- `false`: não pode ser marcada.

Você pode trocar o texto e a imagem dentro do botão livremente.

## Trocar textos e piadas

Textos que aparecem diretamente na página ficam nos arquivos `.html`.
Mensagens criadas depois de cliques ficam nos objetos de configuração no
começo de `js/site.js` e `js/imc.js`.

## Trocar imagens

Coloque a nova imagem em `assets/` e mude o caminho no HTML:

```html
<img src="assets/minha-imagem.jpg" alt="Descrição da imagem">
```

A escova do cabeçalho é definida em `css/style.css`, na regra `.cabecalho`:

```css
background: var(--roxo) url(../assets/escova.png) ...;
```

## Trocar vídeos

Na parte final de `edits.html`, altere o `src`:

```html
<source src="assets/edit1.mp4" type="video/mp4">
```

## Trocar as cores principais

No começo de `css/style.css` ficam as variáveis:

```css
:root {
    --verde: #39ff14;
    --rosa: #ff00ae;
    --amarelo: #fff200;
    --roxo: #7c0d99;
}
```

## Adicionar uma alternativa ao CAPTCHA

Copie um dos botões dentro de `.grade-captcha`, em `edits.html`, e mude seu
conteúdo. A verificação encontra os botões automaticamente, então não é
necessário mudar o JavaScript.

## Testar tudo novamente

O progresso fica salvo no navegador. Use o botão **APAGAR PRONTUÁRIO
(RECOMEÇAR)** no fim da página ou limpe o armazenamento local do navegador.
