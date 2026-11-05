### Testing
Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 12

### Overview

- intro to mongoDB
- creating user and updating user profile
- creating cards, deleting card and getting cards
- like and unlike feature

**Intro**

this project is focusing on creating a database using express, mongoDB/mongoose, node.js, ESLint and airbnb config. This project creates a user profile and create cards for the users profile and stores them into a database. 

**Features**
I have implemented a like and unlike feature, deleting cards from the database, logging middleware for requests and errors, and the ability to find a user via ID.

### Running with PM2

Run the backend under PM2 in production so it restarts after a crash. Install PM2 on the server, then from this project directory run:

```sh
pm2 start app.js --name wtwr-api
pm2 save
```

Configure PM2 startup on the server with `pm2 startup` and follow the command it prints. To verify recovery, request `GET /crash-test`; the request intentionally crashes the Node.js process, and PM2 should restart it. Confirm the restart with `pm2 status`, then make another API request.

[here] is a few links for a brief overview of the project and the journey I have taken to build it.
[Adrian Sandoval project pitch 1] https://www.loom.com/share/e39d27caae8148bda47b1d42bbc7717b
[Adrian Sandoval project pitch 2] https://www.loom.com/share/5d24dbb1ce644f67914f5176a2a97f73

[Adrian Sandoval frontend project] https://github.com/CasaPapas16/se_project_react
