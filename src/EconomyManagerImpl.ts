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

	async addBalance(id: string, amount: number) {
		const user = this.balanceCache.get(id);
		user.balance += amount;
		this.balanceCache.set(id, user);
		try {
			await User.update (
				{ balance: user.balance },
				{
					where: {
						id: id,
					},
				},
			);
		}
		catch (e) {
			console.log(`Failed to update balance in database: ${e}`);
		}


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

	async saveCache() {
		try {
			this.balanceCache.forEach(async u => {
				const user = u;
				const userId = u.id;
				const balance = user.balance;
				await User.update (
					{ balance: balance },
					{
						where: {
							id: userId,
						},
					},
				);
			});
		}
		catch (error) {
			console.log("Error saving cache to database.");
		}
	}

	getCache() {
		return this.balanceCache;
	}

}