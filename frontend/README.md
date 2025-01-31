# Game List Application

### Author: Carl Angelo G. Angcana  
### Course: CMSC 100 - Web Programming  
### Academic Year: 1st Semester 2024-2025  

---

## Overview

This project is a web application developed for the **CMSC 100 - Web Programming** course during the **1st Semester of the 2024-2025 academic year**. The application demonstrates the implementation of **CRUD (Create, Read, Update, Delete)** operations for managing a list of games.

The application allows users to add, view, update, and delete games from a list, showcasing how to interact with both the front-end and back-end using modern web technologies.

## Features

- **Create**: Users can add new games to the list with details such as title and developer.
- **Read**: The app displays a list of all games and allows users to view details for each game.
- **Update**: Users can edit the details of a game after it has been added.
- **Delete**: Users can remove a game from the list permanently.

## Technologies Used

- **Frontend**: 
  - ReactJS for building the user interface.
  - React Router for navigating between pages and dynamic routing.
  
- **Backend**: 
  - Node.js for the server-side application.
  - Express.js for handling HTTP requests.
  - MongoDB for storing game data (using Mongoose ORM).

## Installation

### Prerequisites

- Node.js: You need to have **Node.js** installed on your machine to run the server and client-side applications.
- MongoDB: A working MongoDB instance must be set up with a `GAMES` collection to store game data.

### Acknowledgements
- CMSC 100: Web Programming course, University of the Philippines Los Baños

### License
- This project is open source and available under the **MIT License**.

### Steps to Run the Application

1. **Clone the Repository**:

    ```bash
    https://github.com/CMSC100-Laboratory/routing-frontend.git
    cd routing-frontend

2. **Setup the application**:

    ```bash
    npm install
    npm run dev