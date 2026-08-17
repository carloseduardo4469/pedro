fetch('../components/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('espaco-do-header').innerHTML = data;
    })
    .catch(error => console.error('Erro ao carregar o header:', error));
