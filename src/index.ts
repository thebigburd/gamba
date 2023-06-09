import { Client, GatewayIntentBits } from "discord.js";
import { Bot } from "./Bot";

const bot = new Bot(new Client({ intents: [GatewayIntentBits.Guilds] }));