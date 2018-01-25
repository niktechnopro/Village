# Village

Village is a webapp that builds emotional intelligence in boys. 
A parent creates an account and gives their child the device so they may communicate with our chatbot. 
At the end of the session, the app sends a transcript of the conversation to the account holder. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

MySQL
Node.js
Express.js
JavaScript
jQuery
HTML
CSS
Bootstrap

### Installing
* Clone repository to location of your choice
```
Type git clone, and then paste the URL you copied
git clone https://github.com/NAME/REPOSITORY
```
* Install node libraries
```
sudo npm install
```
* Install MySQL database and import db structure from the following file in root if this repository

```
DB_VILLAGE_2017-12-09.sql
```
* Create a CONFIG folder in root and add config.js file into it for DB and mailer(curently with gmail only) configuration

```
const config = {
    db : {
    	host: '127.0.0.1',
    	user: '...', //user name to log into the database
    	password: '...', //password to log into the database
    	database: '...' //name 
    	},

    mailer : {
    		service: "gmail",
    		host: "smtp.gmail.com",
    		auth: {
        			user: "...", //email address for your mailer
        			pass: "..." //password of mailer address
     			}
     		}
}

module.exports=config;
```


## Built With

* [NodeJS](https://nodejs.org/) - backend enviroment
* [Express.js](https://expressjs.com/) - web framework for node.js
* [MySQL](https://www.mysql.com/) - world's most popular open source relational database
* [HTML, CSS/Bootstrap, JS, jQuery](https://www.w3schools.com/) 

## Authors

* **Alex Trautman** - *Initial work* - [trautmaa](https://github.com/trautmaa)
* **Tai Chen** - *Initial work* - [mindlikewater](https://github.com/mindlikewater)
* **Nikolas Bogucharsky** - *Initial work* - [niktechnopro](https://github.com/niktechnopro)
* **Aasim Merchant** - *Initial work* - [135dragon](https://github.com/135dragon)
* **Audrey Redman** - *Initial work* - [somebodie](https://github.com/somebodie)

See also the list of [contributors]
(https://github.com/VillageAtl/village_frontend/graphs/contributors)
(https://github.com/VillageAtl/village/graphs/contributors)
who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

Big thank you to Goodie Nation (http://goodienation.org/) for making this possible through their Hack The Violence program.
