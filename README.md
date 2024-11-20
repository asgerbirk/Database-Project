# This is our project, ZANDO FITNESS, which contains three courses.
###  - Database
### - Testing 
### - Web Security
<br></br>

## Installation Procedure

### 1. Clone the Repository
git clone < repository-url >

cd < repository-folder >

### 2. Install Dependencies
Make sure you have Node.js installed, then run:

npm install

### 3. Configure Environment Variables
Create a .env file in the project root and provide the necessary environment variables:

DATABASE_URL= < your-database-connection-string >


<br></br>

## Database installation
Our database is hosted on Azure, and we use Prisma as our ORM. Additionally, we have created scripts to assist with database migrations.

### Available Scripts

#### 1. Migrate
Runs the migration process. Use it to apply database changes and specify a migration name.

npm run migrate < migration-name >

#### 2. Pull
Syncs the Prisma schema with the existing database. Use this to pull the current database structure into your Prisma schema.

npm run pull

The Prisma schema is located at:

./src/databases/prisma/schema.prisma

