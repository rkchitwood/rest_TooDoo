# Personal Project: toodoo REST API

## Description:

- **Introduction:** 
    - **TooDoo** is a simple personal to-do application hosted through backend API complete with security features. TooDoo allows users to set and track goals for themselves and organize based on their category. Users progress is tracked through a "score" feature. TooDoo comes conveniently packaged in a docker container.

-  **Resources:**
    - Todos (/todos): Full Create Read Update Delete (CRUD) functionality for a todo. Additionally, hosts "/todos/history" to view a user's completed todos. A todo is typically formatted as { id, name, userId, categoryId, completeDate }, but GET /[todoId] returns additional data from matching ID's to their respective name.
    - Authorization (/auth): Routes for registration and login. Both return a JWT.
    - Users (/users): Full CRUD functionality. Allows users to view and manipulate their own data.
    - Categories (/categories): Read only. Allows a logged in user to get information regarding categories.

- **Technologies Used:**
    - TypeScript, PostgreSQL
    - Automated testing with Jest and Supertest
    - Manual testing with Insomnia
    - Containerization: Docker & Docker Compose

- **Goals:**
    - The goal of this project was to add features to the simple todo concept to improve functionality and user retention. This was achieved through the inclusion of "score" and categories.

- **Usage:**

    - This project via the following commands
    ```
    $ git clone https://github.com/rkchitwood/rest_TooDoo.git
    $ cd rest_TooDoo
    ```
    - Run in a Docker Container:
    ```
    # set up .env:
    POSTGRES_USER=your_username
    POSTGRES_PASSWORD=your_password
    DATABASE_URL=postgresql://your_username:your_password@toodoo-db:5432/toodoo
    # optional secret key
    SECRET_KEY=your-key

    # back to terminal:
    $ docker-compose up -d
    ```
    - Or run locally:
    ```
    $ npm install
    $ psql -f toodoo.sql
    $ npm run build
    $ npm start
    ```
    - The API can be queried at http://localhost:3001/


- **Contributors:**
    - This project was completed in its entirety by [Ryan Chitwood](https://github.com/rkchitwood)