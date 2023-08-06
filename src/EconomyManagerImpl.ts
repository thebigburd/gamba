import { Collection } from "discord.js";
import { EconomyManager } from "./interfaces/EconomyManager";
import User from "./models/User";

export class EconomyManagerImpl implements EconomyManager {
	// Singleton so all slash commands utilise the same Cache.
	private static instance: EconomyManagerImpl;
	balanceCache = new Collection<string, User>();

	private constructor() {
		this.updateCache();
	}

	public static getInstance(): EconomyManagerImpl {
		if (!EconomyManagerImpl.instance) {
			EconomyManagerImpl.instance = new EconomyManagerImpl();
		}
		return EconomyManagerImpl.instance;
	}

	getBalance(id: string): number {
		const user = this.balanceCache.get(id);
		return user ? user.balance : 0;
	}

	addBalance(id: string, amount: number): number {
		const user = this.balanceCache.get(id);
		user.balance += amount;
		this.balanceCache.set(id, user);

		return this.getBalance(id);
	}

	setBalance(id: string, value: number): number {
		const user = this.balanceCache.get(id);
		user.balance = value;
		this.balanceCache.set(id, user);

		return this.getBalance(id);
	}

	async updateCache() {
		try {
			const dbBalances = await User.findAll();
			dbBalances.forEach(u => this.balanceCache.set(u.id, u));
			console.log("All User balances cached.");
		}
		catch (error) {
			console.error(`Failed to cache user balances from database: ${error}`);
		}
	}

	getCache() {
		return this.balanceCache;
	}

}