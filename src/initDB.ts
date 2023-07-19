import "dotenv/config";
import { sequelize } from "./modules/Sequelize";
import User from "./models/User";


(async () => {
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
	}
	catch (error) {
		console.error("Unable to connect to the database:", error);
	}

	try {
		const force = process.argv.includes("--force") || process.argv.includes("-f");
		// Synchronize the models with the database
		// Set 'force' to true to drop the table if it already exists (be cautious with this option in production)
		await sequelize.sync({ force }).then((async () => {
			console.log("Table Created / Database Synced!");
		}));
	}
	catch (error) {
		console.error("Unable to create User table:", error);
	}
	finally {
		// Close the database connection when the table is created
		sequelize.close();
	}
})();
