# react Application  
TalTech Software Project Course 2025  

**Author:**  
Torm Järvelill 

## Introduction  
This is the repository for the **hw-react** project created as part of the Javascript course at TalTech 2024.  
The goal of the project was to build a simple web application using the **Next.js** framework with **React** and **TypeScript**.  
The project demonstrates the setup and development of a react web application, including basic page routing, server-side rendering, and component-based architecture.  


## Getting started  
To run the application locally, follow these steps:

1. Clone or download the repository files.  
2. Install all dependencies using NPM:  
   ```bash
   npm install

3. Run the development server using one of the following commands:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
4. Open your browser and navigate to http://localhost:3000
You should see the home page of the application running.

## Prerequisites

- **Node.js** version 18 or later is required.  
  You can download it from [https://nodejs.org/](https://nodejs.org/).
  
- **NPM** is installed automatically with Node.js.  
  Alternatively, you can use **Yarn**, **pnpm**, or **Bun**.

- **Code Editor:**  
  It is recommended to use **Visual Studio Code (VSCode)** for development.  
  You can install the following extensions for a better experience:
  - ESLint
  - Prettier (optional)
  - Tailwind CSS IntelliSense (optional, if Tailwind is used)
  - TypeScript Toolbox

To verify installation:
    ```bash
    node -v
    npm -v


The project follows the default Next.js layout:

- `/pages` – Contains application routes (e.g., index.tsx for the homepage)
- `/public` – Static assets like images
- `/styles` – Global and modular CSS
- `/components` – Reusable React components (if created)
- `next.config.mjs` – Next.js configuration file
- `package.json` – Lists project dependencies and scripts

## Technologies Used

- **React** – For building component-based user interfaces  
- **Next.js** – Framework for SSR and routing  
- **TypeScript** – For static typing and better developer tooling  
- **Node.js + NPM** – Runtime and package manager for JavaScript  
- **ESLint** – Tool for identifying and fixing code quality issues  
- **Git** – Version control for source code

## Important Notice

The backend server used for authentication is currently **offline**.  
Because of this, the login and registration features don't work at the moment.  



## Screenshots

### Register Page
<img width="1563" alt="Register Page" src="https://github.com/user-attachments/assets/7c644d09-7c81-41a8-baf0-b149252fbe64" />

### Login Page
<img width="1387" alt="Login Page" src="https://github.com/user-attachments/assets/a61c205f-9261-49f2-a3db-8a1087eb4abb" />





