fetch('/api/posts')
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById('posts').getElementsByTagName('tbody')[0];
        data.forEach(item => {
            if (!item.isPosted) {
                const tr = document.createElement('tr');
                const messageTd = document.createElement('td');
                messageTd.textContent = item.message;
                const actionsTd = document.createElement('td');
                const displayBtn = document.createElement('button');
                displayBtn.textContent = "Display";
                displayBtn.addEventListener('click', () => {
                    displayPost(item);
                    location.reload();
                });

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.addEventListener('click', () => {
                    deletePost(item);
                    location.reload();
                });
                
                actionsTd.appendChild(displayBtn);
                actionsTd.appendChild(deleteBtn);
                tr.appendChild(messageTd);
                tr.appendChild(actionsTd);
                tbody.appendChild(tr);
            }
        })
    })

function displayPost(e) {
    fetch('/api/post/' + e._id, {
        headers: {
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        },
        method: "PATCH"
    });
}

function deletePost(e) {
    fetch('/api/post/' + e._id, {
        headers: {
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        },
        method: "DELETE"
    });
}