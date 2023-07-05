
# Gamba - The Discord Card Games Bot.

Gamba is a locally-hosted open source bot that allows you to play games such as Blackjack within a Discord channel. 

## Setup Environment

Clone the project

```bash
  git clone https://github.com/thebigburd/gamba.git
```

Go to the project directory

```bash
  cd gamba
```

Install dependencies

```bash
  npm install
```


## Deployment

To deploy this project fill the .env file with the following details and remove the ".example".

`TOKEN`

`CLIENTID`

`GUILDID`


TOKEN: Your application's Bot Token ([Discord Developer Portal](https://discord.com/developers/applications) > "Bot" > Token)

CLIENTID: Your application's client id ([Discord Developer Portal](https://discord.com/developers/applications) > "General Information" > application id)

GUILDID: Your Discord server's id (Enable developer mode > Right-click the server title > "Copy ID")


Then run the following command in your terminal to register the commands.

```bash
  npm run deploycommands
```

To launch the bot in Discord run:

```bash
  npm start
```

## FAQ


#### Why can I only play Blackjack?

There will be more games to play in the future. Check out the Roadmap section. Updates may take some time as this is my first time delving into Discord Bot development as well as Javascript/Typescript as a language.

#### What's the point of card games if there's nothing at stake?

Currency System is coming in the near future. Currency will be obtainable through staking in the games, but obviously there'll need to be a way for users to get the currency to stake to begin with. 

#### Are there plans to host the Bot online?

It's a possibility but, as of now, there are no plans to do so. The bot hasn't been tested on a large scale so I'm not entirely sure how that will fair.

#### I encountered an issue/bug with the Bot. Where can I report it?

Please submit an issue on the [repository](https://github.com/thebigburd/gamba/issues), and I'll look into it as soon as possible.

## Roadmap

- DockerFile

- Currency System

- Further blackjack mechanics such as Natural payout multiplier

- Higher/Lower Card Game

- Other card games including multiplayer ones.


## Authors

- [@thebigburd](https://github.com/thebigburd)

