fetch('../components/header.html')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ao carregar components/header.html`);
        }
        return response.text();
    })
    .then(data => {
        document.getElementById('espaco-do-header').innerHTML = data;
    })
    .catch(error => console.error('Erro ao carregar o header:', error));
