fetch('/api/posts')
    .then(response => response.json())
    .then(data => {
        const div = document.getElementById('results');
        data.forEach(item => {
            const p = document.createElement('p');
            p.textContent = JSON.stringify(item);
            div.appendChild(p);
        });
    })
    .catch(error => console.error('Failed to fetch data', error));