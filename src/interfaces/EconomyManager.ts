import { Collection } from "discord.js";
import User from "../models/User";


export interface EconomyManager {
	balanceCache : Collection<string, User>;

	getBalance(id) : number;

	addBalance(id, amount);

	setBalance(id, number);

}