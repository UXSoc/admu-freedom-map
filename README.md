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