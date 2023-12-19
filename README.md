
# Gamba v2.2.0 - The Discord Card Games Bot.

Gamba is a locally-hosted open source bot that allows you to play games such as Blackjack within a Discord channel. 


https://github.com/thebigburd/gamba/assets/55106453/c5d11503-04e4-4145-92af-d061606f1021


## Setup Environment

Clone the project

```bash
  git clone https://github.com/thebigburd/gamba.git
```

Go to the project directory

```bash
  cd gamba
```

Install dependencies. If using Docker this is not required.

```bash
  npm install
```


## Deployment

To deploy this project fill the .env file with the following details and remove the ".example".

`TOKEN`

`CLIENTID`

`GUILDID`

`DBHOST`

`DBUSER`

`DBPASS`

TOKEN: Your application's Bot Token ([Discord Developer Portal](https://discord.com/developers/applications) > "Bot" > Token)

CLIENTID: Your application's client id ([Discord Developer Portal](https://discord.com/developers/applications) > "General Information" > application id)

GUILDID: Your Discord server's id (Enable developer mode > Right-click the server title > "Copy ID")

Lastly Database Credentials of your database server. DBHOST=localhost should be used if running locally instead of DBHOST=db.

 If using Docker, these can be left as is, or any value you wish as the database container uses these credentials.

## Running Locally

Then run the following commands in your terminal.

Deploy the commands to the Discord server. This only needs to be done once, or if you ever modify a command.

```bash
  npm run deploycommands
```

Then to initialise the Users table in the database.

```bash
  npm run initDB
```

Finally launch the bot in Discord:

```bash
  npm start
```
And that is all, the bot should be up and running in your server!

## Running with Docker

If using Docker, build the containers.

```bash
    docker compose up -d
```
Deploy the commands to the Discord server by running the following script in the gamba-bot's terminal. This only needs to be done once, or if you ever modify a command.

```bash
  npm run deploycommands
```

Then initialise the Users table in the database, by running in the gamba-bot's terminal again:

```bash
    npm run initDB
```


The bot should now be up and running in your server!

## FAQ


#### Will there be more games to play?

There will be more games to play in the future. Perhaps even non-card games. Check out the Roadmap section. Updates may take some time as this is my first time delving into Discord Bot development as well as Javascript/Typescript as a language.


#### Are there plans to host the Bot online?

It's a possibility but, as of now, there are no plans to do so. The bot hasn't been tested on a large scale so I'm not entirely sure how that will fair.

#### When running the Bot locally, why do none of the Economy commands work?

In the .env file, make sure to switch the database host to localhost.

` DBHOST=localhost`

#### When deploying the Bot with Docker, why do none of the Economy commands work?

When the application is deployed for the first time, you need to run in the gamba bot container's terminal:

```bash
    npm run initDB
```

This will set up the Users table in the database. You do not need to do this every time you run the container, only for the first time.

#### I encountered an issue/bug with the Bot. Where can I report it?

Please submit an issue on the [repository](https://github.com/thebigburd/gamba/issues), and I'll look into it as soon as possible.

## Roadmap
While the Roadmap shows features that I'll be working on at some point, it may change if I believe there is something of higher priority to do.

- Improved User Experience / QoL

- Further blackjack mechanics such as Natural multiplier, Split, Double-down.

- Other card games including multiplayer ones.


## Authors

- [@thebigburd](https://github.com/thebigburd)

