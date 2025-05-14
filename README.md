# Atenean Freedom Map
The Atenean Freedom Map is an interactive web application that allows users to explore a map, add pins with messages, and view or moderate user-submitted content.


<h3 align="center">
    🗺️ Try it out here: <a href="https://admu-freedom-map.fly.dev/">Atenean Freedom Map </a> 🗺️
</h3>



## Technologies Used
- **Frontend**: HTML, CSS, JavaScript, D3.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB

## Features
- **Interactive Map**: Users can pan and zoom the map to explore different areas.
- **Add Pins**: Users can add pins to the map with custom messages.
- **Speech Bubbles**: Hovering over a pin displays its message in a speech bubble.
- **Moderation**: Admins can review, approve, or delete user-submitted pins.
- **Responsive Design**: The application is designed for both desktop and mobile devices.

## Installation
0. Install [Node.js](https://nodejs.org/en/download) on your local machine.

1. Clone the repository:
    ```sh
    git clone https://github.com/UXSoc/admu-freedom-map
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Create a `.env` file by duplicating `env.template`. Edit the `.env` file according to your MongoDB credentials:
    ```sh
    MONGODB_USER=<your-mongodb-username>
    MONGODB_PASS=<your-mongodb-password>
    ```
4. Start the server locally:
    ```sh
    npm start
    ```
5. Open your browser and navigate to `http://localhost:3000`.

## Moderation Notes
Moderators can access the admin page by adding `/admin` to the website's url. Then, a login view will be prompted, where a username and password is needed to access the admin view.

Moderators can:
- **Accept** or **Reject** posted pin messages.
- **Delete** already-posted pins. 

Ask UX Society's Engineering Department for the admin user credentials to access the admin view.

### How to create a new admin user

The current implementation of the user authentication system for the admin page uses [bcrypt](https://www.npmjs.com/package/bcrypt), a library that helps in hashing passwords. This means that the MongoDB database contains only hashed passwords of the admin users.

**Only follow the steps below if the current project members wish to add more admin users. Ask the past project members if the existing admin user credentials is forgotten.**

To add a new admin user:

1. Have access to the MongoDB connection string. Ask past developers for this.
2. Connect to the MongoDB database (commonly through [MongoDB Compass](https://www.mongodb.com/try/download/atlascli)).
3. Add a new document under the **admins** collection, under **test** database.

    3.1. Copy the format of the existing document.

4. You shall be seeing that the existing password for the existing admin credential is hashed. To hash your preferred password, use [this website](bcrypt-generator.com). **Use 12 rounds of hashing**.

5. After adding a new document, you can now login to ther admin page with your new admin credentials.
