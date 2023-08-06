import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../modules/Sequelize";


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

export default User;
