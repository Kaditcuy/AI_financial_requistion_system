Npdejs for web app
Express for the backend
react for the frontend
MySQL for database
Venv for all python dependencies beacsue of AI
pacakage.json to track all nodejs dependecies
nodedemon to automatically start the server during development

````Architecture
Web Application Layer (Node.js + Express)

API Routes: Use Express to create RESTful API endpoints that handle client requests, such as submitting financial requisitions, retrieving data, or user authentication.
Frontend Integration: Connect your web frontend (React, Angular, etc.) to the Express API for a seamless user experience.

AI Services Layer (Python with Flask or FastAPI)
Microservice for AI: Create a separate microservice using Flask or FastAPI to handle all AI-related tasks, such as:
Training machine learning models using libraries like scikit-learn, pandas, and numpy.
Making predictions based on incoming requisition data.
Performing data analysis and generating insights.
API Integration: Your Node.js application can communicate with this Python service via HTTP requests (e.g., using Axios or Fetch in the frontend) to send data and receive predictions or analyses.
Database Layer

You can use a single database (e.g., MySQL or PostgreSQL) that both your Node.js application and Python service access. This allows you to store and retrieve data efficiently.
Use an ORM (like Sequelize for Node.js or SQLAlchemy for Python) for easier database interactions.
Benefits of This Approach
Flexibility: You can utilize the strengths of both Node.js and Python, allowing you to choose the best tools for each specific task (web handling vs. AI/ML).
Scalability: You can scale your AI services independently from your web application, making it easier to manage resource allocation.
Maintainability: Each part of your application can be developed and maintained separately, which can simplify updates and debugging.```
````
