# AI Services Directory

The `ai_services` directory contains all Python scripts for implementing AI services within the financial requisition system. This directory leverages essential Python libraries for machine learning and data analysis to enhance the functionality of the system.

## Setup Instructions

1. **Activate Virtual Environment**  
   Before installing any Python packages and dependencies, ensure that you activate the virtual environment in the parent directory. This helps manage project-specific dependencies without affecting the global Python environment.

   ```bash
   source ../venv/bin/activate  # For Linux/Mac
   .\venv\Scripts\activate  # For Windows

   ```

2. **Install Essential Python Packages**
   Install the following essential Python packages:

   ```bash
   pip install scikit-learn pandas numpy

   ```

# Python Packages Overview

## scikit-learn

`scikit-learn` is a widely used machine learning library that provides tools to build and train machine learning models for various tasks, including:

- **Predicting Customer Behavior**: Use machine learning models to forecast how customers will interact with your financial requisition system.
- **Forecasting Inventory Needs**: Leverage algorithms to predict future inventory requirements based on historical data.
- **Optimizing Financial Requisition Processes**: Implement models to streamline and enhance the requisition workflow.

This library includes essential tools for data preparation before feeding it into machine learning models. For categorizing requisition requests or segmenting customers based on behavior, `scikit-learn` offers algorithms for clustering (e.g., K-Means) and classification (e.g., decision trees, support vector machines).

## pandas

`pandas` is a powerful library for data manipulation and analysis, providing the following features:

- **Data Structures**: Offers DataFrames, which are ideal for handling tabular data (e.g., customer requisition records), making it easier to analyze and manipulate data.
- **Data Cleaning and Preparation**: Streamlines the process of cleaning and preparing data for analysis, including handling missing values, filtering rows, and aggregating data.
- **Time Series Analysis**: Provides robust functionalities for analyzing time-sensitive data (e.g., transaction history), which aids in forecasting and trend analysis.
- **Integration with Other Libraries**: Works seamlessly with other libraries like NumPy and `scikit-learn`, enabling efficient complex data analysis and machine learning tasks.

## numpy

`numpy` is a fundamental library for numerical computing in Python, offering:

- **Numerical Operations**: Supports large multi-dimensional arrays and matrices, along with a collection of mathematical functions to operate on these arrays, essential for financial data analysis.
- **Performance**: Provides faster performance for numerical operations compared to standard Python implementations, significantly speeding up calculations with large datasets.
- **Integration with Other Libraries**: Serves as a foundational library for numerical operations, with many data science libraries, including `pandas` and `scikit-learn`, built on top of it.

# Directory Structure

## ai_services/

Contains all AI-related Python scripts for implementing machine learning and data analysis functionalities.

### Usage

To run any of the Python scripts, ensure the virtual environment is activated, and use the following command:

```bash
python script_name.py  # Replace with the actual script name

```

Used postgres sql for the chatbot's database:
After installing postgres server , create db by

postgres@MSI:~$ CREATE DATABASE chatbot_db;
CREATE: command not found
postgres@MSI:~$ psql
psql (16.6 (Ubuntu 16.6-0ubuntu0.24.04.1))
Type "help" for help.

postgres=# CREATE DATABASE #
postgres-# CREATE USER # WITH PASSWORD "#"
postgres-# GRANT ALL PRIVILEGES ON DATABASE # TO #

update .env.local to point to the postgres database server
Since chat_bot folder already has a drizzle.config.ts file with the configuration for migrations using drizzle-kit, migrations are much easier to manage, as it can automatically generate migration files and run them for you. Here's how you can proceed to set up and manage database migrations using drizzle-kit:

Steps to Set Up and Use Migrations with drizzle-kit
1. Ensure Environment Variables are Set
Make sure your .env.local file contains the correct connection string for your PostgreSQL database:

POSTGRES_URL=postgresql://username:password@localhost:5432/your_db_name
Replace username, password, and your_db_name with your actual PostgreSQL credentials.

2. Install drizzle-kit
If you haven't installed drizzle-kit yet, you can do so by running:

npm install drizzle-kit

3. Generate Migration Files
Once you have drizzle.config.ts set up correctly, you can generate migration files using the drizzle-kit CLI. To do this, run:

npx drizzle-kit generate

This will compare the current state of your schema defined in lib/db/schema.ts with your database and generate a new migration file in the lib/db/migrations directory. The migration file will contain SQL commands to create or modify the tables according to your schema.

4. Run the Migrations
Once the migration file is generated, you can apply the migration to your PostgreSQL database using:

npx drizzle-kit migrate

This will execute the SQL commands in the migration file and update your database schema.

5. Check for Pending Migrations
To see if there are any pending migrations, you can run:

bash
Copy
Edit
npx drizzle-kit status
This will show you the current state of your migrations, whether they're up-to-date or if there are any pending migrations that need to be run.

6. Rollback a Migration (Optional)
If you need to undo the last migration, you can use:

bash
Copy
Edit
npx drizzle-kit rollback
This will revert the last applied migration.

7. Adding New Migrations (After Schema Changes)
Whenever you make changes to your schema (e.g., add new tables or modify existing ones), you'll need to regenerate the migration file:

npx drizzle-kit generate



npx drizzle-kit migrate
Example: Workflow Summary
Define Schema: Your lib/db/schema.ts contains the schema definitions using Drizzle ORM.
Generate Migration: Run npx drizzle-kit generate to generate the SQL migration files.
Apply Migrations: Run npx drizzle-kit migrate to apply migrations to the database.
Check Migration Status: Use npx drizzle-kit status to check if migrations are up-to-date.
Rollback Migrations: If needed, roll back using npx drizzle-kit rollback.
With drizzle-kit, managing migrations is simplified because it handles schema changes and their application to the database automatically. You just need to ensure that you generate and apply migrations whenever you update the schema.\




OR simply run the migrate.ts file in lib/db to populate the db with its tables and structure make sure to use type:module in package.json to allow import/export and also install ts node
npm install ts-node

run migration script
npx ts-node lib/db/migrate.ts

now signup on chatbot should work

Or run npm install
check pacakge.json on how scripts should be run including migrations.
which is pnpm run db:migrate

make sure to login into your postgres server as root user, connect to your chat db and alter ALTER SCHEMA public OWNER TO "#db_username"; 


