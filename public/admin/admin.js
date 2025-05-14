// Function to fetch and render posts
function fetchAndRenderPosts() {
    fetch('/api/posts')
        .then(response => response.json())
        .then(data => {
            const pendingTbody = document.getElementById('posts').getElementsByTagName('tbody')[0];
            const postedTbody = document.getElementById('posted-pins').getElementsByTagName('tbody')[0];
            const emptyMessage = document.getElementById('empty-message');
            const emptyPostedMessage = document.getElementById('empty-posted-message');

            // Clear existing rows
            pendingTbody.innerHTML = '';
            postedTbody.innerHTML = '';

            // Filter and display pending posts
            const pendingPosts = data.filter(item => !item.isPosted);
            if (pendingPosts.length === 0) {
                emptyMessage.style.display = 'block';
            } else {
                emptyMessage.style.display = 'none';
                pendingPosts.forEach(item => {
                    const tr = document.createElement('tr');

                    // Message column
                    const messageTd = document.createElement('td');
                    messageTd.textContent = item.message;

                    // Actions column
                    const actionsTd = document.createElement('td');
                    actionsTd.classList.add('actions');

                    const approveBtn = document.createElement('button');
                    approveBtn.textContent = 'Approve';
                    approveBtn.classList.add('approve-btn');
                    approveBtn.addEventListener('click', () => {
                        approvePost(item._id);
                    });

                    const rejectBtn = document.createElement('button');
                    rejectBtn.textContent = 'Reject';
                    rejectBtn.classList.add('reject-btn');
                    rejectBtn.addEventListener('click', () => {
                        rejectPost(item._id);
                    });

                    actionsTd.appendChild(approveBtn);
                    actionsTd.appendChild(rejectBtn);

                    tr.appendChild(messageTd);
                    tr.appendChild(actionsTd);
                    pendingTbody.appendChild(tr);
                });
            }

            // Filter and display posted pins
            const postedPins = data.filter(item => item.isPosted);
            if (postedPins.length === 0) {
                emptyPostedMessage.style.display = 'block';
            } else {
                emptyPostedMessage.style.display = 'none';
                postedPins.forEach(item => {
                    const tr = document.createElement('tr');

                    // Message column
                    const messageTd = document.createElement('td');
                    messageTd.textContent = item.message;

                    // Coordinates column
                    const coordinatesTd = document.createElement('td');
                    coordinatesTd.textContent = `(${item.x}, ${item.y})`;

                    // Actions column
                    const actionsTd = document.createElement('td');
                    actionsTd.classList.add('actions');

                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Delete';
                    deleteBtn.classList.add('reject-btn');
                    deleteBtn.addEventListener('click', () => {
                        deletePost(item._id);
                    });

                    actionsTd.appendChild(deleteBtn);

                    tr.appendChild(messageTd);
                    tr.appendChild(coordinatesTd);
                    tr.appendChild(actionsTd);
                    postedTbody.appendChild(tr);
                });
            }
        })
        .catch(error => console.error('Error fetching posts:', error));
}

// Approve a post
function approvePost(postId) {
    fetch(`/api/post/${postId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPosted: true }),
    })
        .then(response => {
            if (response.ok) {
                fetchAndRenderPosts(); // Reload posts after approval
            } else {
                console.error('Failed to approve post');
            }
        })
        .catch(error => console.error('Error approving post:', error));
}

// Reject a post
function rejectPost(postId) {
    fetch(`/api/post/${postId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.ok) {
                fetchAndRenderPosts(); // Reload posts after rejection
            } else {
                console.error('Failed to reject post');
            }
        })
        .catch(error => console.error('Error rejecting post:', error));
}

// Delete a posted pin
function deletePost(postId) {
    fetch(`/api/post/${postId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.ok) {
                fetchAndRenderPosts(); // Reload posts after deletion
            } else {
                console.error('Failed to delete posted pin');
            }
        })
        .catch(error => console.error('Error deleting posted pin:', error));
}

// Initial fetch and render of posts
fetchAndRenderPosts();