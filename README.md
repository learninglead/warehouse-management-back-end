# Node.js CRUD with Express and PostgreSQL
This project was created to try CRUD operations.

## Project Directory Structure
The directory structure of project is following:

```bash
.
├── src
│   ├── constants
│   │   └── index.js
│   ├── controllers
│   │   └── user.controller.js
│   ├── db
│   │   └── index.js
│   ├── middlewares
│   │   └── error.middleware.js
│   ├── routes
│   │   └── user.route.js
│   └── index.js
├── package-lock.json
├── package.json
└── server.js

6 directories, 9 files
```

## Installation

Use the package manager [npm](https://www.npmjs.com) to install dependencies. In the project directory:

```bash
npm install
```

## Environment Variables

The content of .env file is following:

```bash
DB_USER     = <database_username>
DB_HOST     = <database_host>
DB_NAME     = <database_name>
DB_PASS     = <database_password>
DB_PORT     = <database_port_number>
SERVER_PORT = <project_port_number>
```

## Usage

PostgreSql must be ready before the project is started.

A table named `users` is used. You can create a table on postgres database using following query:

```sql
CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(30),
  email VARCHAR(30)
);
```

To run the project:

```bash
npm start
```