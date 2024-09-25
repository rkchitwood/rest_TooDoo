# Personal Project: toodoo REST API

## Description:

- **Introduction:** 
    - **TooDoo** is a simple personal to-do application hosted through backend API complete with security features. TooDoo allows users to set and track goals for themselves and organize based on their category. Users progress is tracked through a "score" feature.

-  **Resources:**
    - Todos (/todos): Full Create Read Update Delete (CRUD) functionality for a todo. Additionally, hosts "/todos/history" to view a user's completed todos. A todo is typically formatted as { id, name, userId, categoryId, completeDate }, but GET /[todoId] returns additional data from matching ID's to their respective name.
    - Authorization (/auth): Routes for registration and login. Both return a JWT.
    - Users (/users): Full CRUD functionality. Allows users to view and manipulate their own data.
    - Categories (/categories): Read only. Allows a logged in user to get information regarding categories.

- **Technologies Used:**
    - TypeScript, PostgreSQL
    - Automated testing with Jest and Supertest
    - Manual testing with Insomnia

- **Goals:**
    - The goal of this project was to add features to the simple todo concept to improve functionality and user retention. This was achieved through the inclusion of "score" and categories.

- **Usage:**

    - This project can be ran locally by the following commands
    ```
    $ git clone https://github.com/rkchitwood/rest_TooDoo.git
    $ npm install
    $ psql -f toodoo.sql
    # respond to prompts by hitting ENTER
    $ npm run build
    $ npm start
    ```

- **Contributors:**
    - This project was completed in its entirety by [Ryan Chitwood](https://github.com/rkchitwood)