// Set the base URL of your backend API
const API_BASE_URL = 'https://omkar-linkedin-backend.onrender.com'; 

document.addEventListener('DOMContentLoaded', () => {
    // Check which page we are on and run the correct setup function
    if (document.getElementById('login-form')) {
        setupLoginPage();
    } else if (document.getElementById('signup-form')) {
        setupSignupPage();
    } else if (document.getElementById('post-feed-container')) {
        setupFeedPage();
    }
});

// --- SIGNUP PAGE LOGIC ---
function setupSignupPage() {
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', handleSignup);
}

async function handleSignup(event) {
    event.preventDefault();
    const errorElement = document.getElementById('signup-error');
    errorElement.textContent = ''; // Clear old errors

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!name || !email || !password) {
        errorElement.textContent = 'All fields are required.';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Signup successful! Please login.');
            window.location.href = 'login.html'; // Redirect to login
        } else {
            // Display error message from server (e.g., "Email already in use")
            errorElement.textContent = data.message || 'Signup failed.';
        }
    } catch (error) {
        console.error('Signup error:', error);
        errorElement.textContent = 'Signup failed. Please check your network connection.';
    }
}

// --- LOGIN PAGE LOGIC ---
function setupLoginPage() {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', handleLogin);
}

async function handleLogin(event) {
    event.preventDefault();
    const errorElement = document.getElementById('login-error');
    errorElement.textContent = ''; // Clear old errors

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        errorElement.textContent = 'Email and password are required.';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Login successful
            localStorage.setItem('token', data.token); // Save the token
            localStorage.setItem('userName', data.user.name); // Save user's name
            window.location.href = 'index.html'; // Redirect to the feed page
        } else {
            // Display error message from server (e.g., "Invalid credentials")
            errorElement.textContent = data.message || 'Login failed.';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorElement.textContent = 'Login failed. Please check your network connection.';
    }
}

// --- FEED PAGE LOGIC ---
function setupFeedPage() {
    const token = localStorage.getItem('token');
    
    // If not logged in, redirect to login page
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // User is logged in, display their name
    const userName = localStorage.getItem('userName');
    document.getElementById('user-name-display').textContent = `Welcome, ${userName}`;
    
    // Setup logout button
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', handleLogout);
    
    // Setup create post form
    const createPostForm = document.getElementById('create-post-form');
    createPostForm.addEventListener('submit', handleCreatePost);

    // Fetch and display all posts
    fetchAllPosts();
}

function handleLogout() {
    // Clear user data from storage
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

async function handleCreatePost(event) {
    event.preventDefault();
    const errorElement = document.getElementById('post-error');
    errorElement.textContent = ''; // Clear old errors
    
    const token = localStorage.getItem('token');
    const textContent = document.getElementById('post-text-content').value;

    if (!textContent) {
        errorElement.textContent = 'Post cannot be empty.';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Send the token for auth
            },
            body: JSON.stringify({ text: textContent })
        });

        if (response.ok) {
            document.getElementById('post-text-content').value = ''; // Clear textarea
            fetchAllPosts(); // Refresh the feed to show the new post
        } else {
            const data = await response.json();
            errorElement.textContent = data.message || 'Error creating post.';
        }
    } catch (error) {
        console.error('Create post error:', error);
        errorElement.textContent = 'Could not create post. Check network connection.';
    }
}

async function fetchAllPosts() {
    const token = localStorage.getItem('token');
    const feedContainer = document.getElementById('post-feed-container');
    feedContainer.innerHTML = 'Loading posts...';

    try {
        const response = await fetch(`${API_BASE_URL}/posts`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            // Handle HTTP errors like 404 or 500
            throw new Error(`Failed to fetch posts. Status: ${response.status}`);
        }

        const posts = await response.json();
        
        feedContainer.innerHTML = ''; // Clear "Loading..."

        if (posts.length === 0) {
            feedContainer.innerHTML = '<p>No posts yet. Be the first!</p>';
            return;
        }

        // The assignment requires latest posts first.
        // Your backend should send them in this order (e.g., sorted by createdAt descending).
        posts.forEach(post => {
            const postElement = createPostElement(post);
            feedContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error('Fetch posts error:', error);
        feedContainer.innerHTML = '<p style="color: red;">Error loading posts. Please try again later.</p>';
    }
}

function createPostElement(post) {
    const postArticle = document.createElement('article');
    postArticle.className = 'post';

    const authorName = document.createElement('h4');
    authorName.className = 'post-author';
    // Use user's name from the post object, or "Unknown User" if user data is missing
    authorName.textContent = (post.user && post.user.name) ? post.user.name : 'Unknown User'; 

    const postTime = document.createElement('span');
    postTime.className = 'post-time';
    // Format the date to be more readable
    postTime.textContent = new Date(post.createdAt).toLocaleString(); 

    const postContent = document.createElement('p');
    postContent.className = 'post-content';
    postContent.textContent = post.text;

    postArticle.appendChild(authorName);
    postArticle.appendChild(postTime);
    postArticle.appendChild(postContent);

    return postArticle;
}