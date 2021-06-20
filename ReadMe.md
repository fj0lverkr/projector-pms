# Projector PMS
## Intro
Projector is a free and open source project management app written in NodeJS, Pug and Bootstrap 5.
## Getting Started
After cloning this repo and optionally moving it to a suitable location follow these steps to get started using or working on Projector:
1. in a terminal, cd into the folder where you've cloned or moved the repo.
2. run `npm install`, this should install all required packages (and assumes you have Node installed on the machine).
3. copy template.env to just .env
4. edit .env and set the values to reflect your environment. This requires having set up Okta (Google will help you here) and access to a MySQL server instance.
5. open the /install/projector.sql file and if you wish, change the database name on the first two lines.
6. run the full file on your MySQL instance. **NOTE that this will drop all tables and recreates them, BACKUP DATA FIRST!**
7. start the server by typing `npm start` in your terminal. After a few seconds the message *Server listening on port [portnumber]* should appear.
8. in a webbrowser, go to the adress for the Projector instance, e.g. http://localhost:8080
9. log in, in everything is set up correctly this should redirect you to your Okta login page and back to Projector.
10. now click on your name on the right-hand side of the top bar, this will insert a new `user_extra` record in the database.
11. run the following query to set yourself as an admin: `UPDATE projector_dev.user_extra set user_role = 1 WHERE iduser_extra IS NOT NULL;`.
Note that running this query will make all users admin, not just yours. If there are somehow already some other users on your database, adjust the query to only do this for your user.

That should be it, you are good to go!
