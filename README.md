Northcoders News API project

Link to hosted version

https://nc-news-be-project-lndv.onrender.com/api/

This project involves building a robust API to provide application data programmatically, resembling real-world backend services like Reddit. The database is PostgreSQL, and interactions with it are facilitated using node-postgres.

Technologies

Node.js
PostgreSQL
Express.js
Other libraries and frameworks

Installation
To get started with this project, follow these steps:

Clone the Repository:

https://github.com/sweepas/nc-news-pro

1. Clone the project repository from GitHub using the following command:
   $git clone <repository_url>

2. Navigate to project folder using
   $cd project-name

3. Install the project dependencies using npm:
   $npm install

dependencies requirments

"dotenv": "^16.0.0",
"express": "^4.18.2",
"pg": "^8.7.3"

Seeding the Local Database

Make sure you have PostgreSQL installed and running on your local machine. You can find mmore information in the link below
https://www.postgresql.org/download/

Setting up Environment Variables

This project requires environment variables to connect to the databases.

.env.test
.env.development

Add the PGDATABASE= variable with the correct database name for each environment. Refer to /db/setup.sql for the database names. Ensure these .env files are listed in .gitignore.

Run the seed file using the following command:
$npm run seed

To run test you may need to install jest. To install it you can find more information below:
https://jestjs.io/docs/getting-started

To run the test use:
$npm test
