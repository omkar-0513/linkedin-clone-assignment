This project is a simple full-stack social media website, built as an assignment for the AppDost Full Stack Developer Internship. 
It allows users to sign up, log in, create text-based posts, and view a public feed of all posts from all user.


Features
User Authentication: Users can register for a new account with an email and password.
User Login: Registered users can log in to access the site.
Create Post: Once logged in, a user can write and publish a new text post.
Public Feed: All posts from all users are displayed on a central feed, with the latest posts shown first.
Navbar Display: The logged-in user's name is displayed on the top bar.


Tech Stack
This project was built with the following technologies:
Frontend: HTML, CSS, JavaScript (Vanilla)
Backend: Node.js, Express.js 
Database: MongoDB

How to Run Locally
To run this project on your local machine, you will need to run the backend server and open the frontend files.

1. Backend Setup
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

# 2. Navigate to the backend folder
cd YOUR_REPOSITORY/backend

# 3. Install dependencies
npm install

# 4. Create a .env file in the /backend folder
#    You must add your own MongoDB URI and a JWT Secret
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_for_jwt

# 5. Start the server
node index.js
The backend server will be running on http://localhost:5000.

2. Frontend Setup
The frontend consists of static HTML, CSS, and JS files.

# 1. Navigate to the frontend folder
cd YOUR_REPOSITORY/frontend

# 2. Open the login.html file
#    The easiest way is to use a live server extension
#    (like 'Live Server' in VS Code).
