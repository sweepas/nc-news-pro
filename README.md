nc-news-pro

Installation
To get started with this project, follow these steps:

Clone the Repository:

Clone this repository to your local machine.

bash
Copy code
git clone <repository_url>
cd project-name
Install Dependencies:

Install project dependencies using your preferred package manager.

Copy code
npm install

Setting up Environment Variables

This project requires environment variables to connect to the databases.

.env.test
.env.development

Add the PGDATABASE= variable with the correct database name for each environment. Refer to /db/setup.sql for the database names. Ensure these .env files are listed in .gitignore.
