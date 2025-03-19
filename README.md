# Bookit

https://github.com/user-attachments/assets/4587b4e6-3960-4f88-a9eb-11017e010324

## Overview

This project consists of a `project` application and `server`. Follow the steps below to set up and run the project.

## project Setup

1. Navigate to the `project` directory.
2. Run `npm install` to install the necessary dependencies.

## server Setup

1. Navigate to the `server` directory.
2. Create a `.env` file on the root of api directory and add 

`(PORT=1004
NODE_ENV=development
MONGODB_URI={YOUR_MONGODB_URI}
JWT_SECRET={ANY 8 character Alphanumeric characters}
JWT_EXPIRES_IN=24h (Feel free to modify)
ALLOWED_ORIGINS=http://localhost:5175 (make sure to keep project origin)
OPENAI_API_KEY={YOUR_OPENAI_KEY})`

2. Run `npm install` to install the node_modules and same dependencies used in the `server`.

## Running the Project

After setting up the `project` and `server`, you can run the project by following these steps:

1. Start the `server` by running `npm run dev   (npm run build - if needed)`.
2. Start the `client` application by running `npm run dev` in the project directory.

![bookit-user](https://github.com/user-attachments/assets/3afd2237-1358-46ca-b8a5-a393a25c2ac7)

![bookit-admin](https://github.com/user-attachments/assets/2c000a70-59ab-4f0f-af1f-fb4531323578)
