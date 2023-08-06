import "dotenv/config";
import { after, before, describe } from "mocha";
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { expect } from "chai";

// Test Database Connection Params
const sequelize = new Sequelize(`${process.env.TESTDATABASE}`, `${process.env.DBUSER}`, `${process.env.DBPASS}`, {
	host: "localhost",
	dialect: "postgres",
	port: Number(process.env.PORT),
	logging: console.log,
});

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	declare id: string;
	declare balance: number;
	declare dailyClaim: CreationOptional<Date>;
}

User.init(
	{
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			unique: true,
		},
		balance: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		dailyClaim: {
			type: DataTypes.DATE,
		},
	},
	// Options
	{
		sequelize,
		tableName: "Users",
		timestamps: false,
	},
);


describe("Database CRUD Tests", () => {
	before(async () => {
		try {
			await sequelize.authenticate();
			console.log("Connection has been established successfully.");
		}
		catch (error) {
			console.error("Unable to connect to the database:", error);
		}

		try {
			console.log(sequelize.models);
			// Synchronize the models with the database
			// Set 'force' to true to drop the table if it already exists (be cautious with this option in production)
			await sequelize.sync({ force: true }).then((async () => {
				console.log("Table Created / Database Synced!");
			}));
		}
		catch (error) {
			console.error("Unable to create User table:", error);
		}
	});

	after(async () => {
		await User.drop();
		sequelize.close();
	});

	describe("Database Interactions", () => {
		it("Should CREATE new users in the database", async () => {

			// Act
			const newUser = await User.create({ id: "1", balance: 1000 });

			// Assert
			const storedUser = await User.findOne({ where: { id: "1" } });
			expect(newUser.balance).to.equal(storedUser.balance);
			expect(storedUser.dailyClaim).to.be.null;

		});

		it("Should be able to UPDATE existing Users in the database", async () => {
			// Act
			await User.update(
				{ balance: 9999 },
				{ where: { id: "1" } },
			);

			// Assert
			const updatedUser = await User.findOne({ where: { id: "1" } });
			expect(updatedUser.balance).to.equal(9999);

		});

		it("Should DELETE User from the database", async () => {
			// Act
			await User.destroy({
				where: { id: "1" },
			});

			// Assert
			const userList = await User.findAll();
			expect(userList.length).to.equal(0);
		});
	});
});