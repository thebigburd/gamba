import "dotenv/config";
import { Sequelize } from "sequelize";

// Database Connection Params
export const sequelize = new Sequelize(`${process.env.DATABASE}`, `${process.env.DBUSER}`, `${process.env.DBPASS}`, {
	host: `${process.env.DBHOST}`,
	dialect: "postgres",
	logging: console.log,
});
