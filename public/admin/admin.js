const passwordPage = document.getElementById('password-page');
const adminPage = document.getElementById('admin-page');
const submitPasswordButton = document.getElementById('submit-password');
const adminPasswordInput = document.getElementById('admin-password');
const errorMessage = document.getElementById('error-message');

// Check if the user is already authenticated
if (localStorage.getItem('token')) {
    verifyTokenAndShowAdminPage();
} else {
    showPasswordPage();
}

// Show the password input page
function showPasswordPage() {
    passwordPage.style.display = 'flex';
    adminPage.style.display = 'none';
}

// Show the admin moderation page
function showAdminPage() {
    passwordPage.style.display = 'none';
    adminPage.style.display = 'block';
    fetchAndRenderPosts(); // Fetch and render posts when the admin page is shown
}

// Handle password submission
submitPasswordButton.addEventListener('click', () => {
    const username = document.getElementById('admin-username').value.trim();
    const password = adminPasswordInput.value;
    console.log(username);
    console.log(password);
    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Invalid username or password');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('token', data.token); // Store the token
            showAdminPage();
        })
        .catch(error => {
            errorMessage.style.display = 'block'; // Show error message
            console.error('Error during login:', error);
        });
});

// Verify the token and show the admin page
function verifyTokenAndShowAdminPage() {
    const token = localStorage.getItem('token');
    fetch('/api/posts', {
        headers: {
            Authorization: token,
        },
    })
        .then(response => {
            if (response.ok) {
                showAdminPage();
            } else {
                throw new Error('Unauthorized');
            }
        })
        .catch(error => {
            console.error('Error verifying token:', error);
            showPasswordPage();
        });
}

// Fetch and render posts
function fetchAndRenderPosts() {
    const token = localStorage.getItem('token');
    fetch('/api/posts', {
        headers: {
            Authorization: token,
        },
    })
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
    const token = localStorage.getItem('token');
    fetch(`/api/post/${postId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token,
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
    const token = localStorage.getItem('token');
    fetch(`/api/post/${postId}`, {
        method: 'DELETE',
        headers: {
            Authorization: token,
        },
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
    const token = localStorage.getItem('token');
    fetch(`/api/post/${postId}`, {
        method: 'DELETE',
        headers: {
            Authorization: token,
        },
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