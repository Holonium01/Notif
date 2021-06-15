# Simple Notification System. 

This is a notication system that sends a twnety-four hour and one-hour email reminder for order pickup

# Geting  Started.
- To Start server,  run `node server` or `docker-compose up`

# Design  Document.
- url https://smallpdf.com/shared#st=2d8af6c6-32cc-410c-97cc-df06e4dfb55e&fn=Notification+system+design.pdf&ct=1619295590948&tl=share-document&rf=link

- Note: this URL will be unavalable after 14 days, strting from 24th April, 2021

## File Structure
```
├── package.json
├── package-lock.json
├── .env
├── .gitignore
├── node_modules
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
├── app.js
├── config
│   ├── config.js
│   ├── db-connection.js
│   └── express.js
└── src
    ├── workers
        |
        |── records.controller.js
    ├── models
        |── user.modeljs
        |── order.model.js
        |── store.model.js
        |── inde.js
    ├── notification
        |── send-email.js
    |── handlers
        |── get-order.js
    |── helpers
        |── index.js
    ├── workers
        |── tasks
            |── send-notification.js
        |── scheduler.js
└── README.md
```

## config
This folder contains all the environment variables.

## workers
Contains the cron and the main tasks executed.

## notification
Contains the email server that send the email.

## models
This folder contains all the models

## handlers
This contains the main function of the app that interacts with the DB.

## helpers
This contains the util functions that are often used in the app

