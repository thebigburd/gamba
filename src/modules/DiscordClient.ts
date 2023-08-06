import { Client, Collection } from "discord.js";
import { Command } from "../interfaces/Command";
import { EconomyManagerImpl } from "../EconomyManagerImpl";


export class DiscordClient extends Client {

	public commands;
	public economyManager: EconomyManagerImpl;

}