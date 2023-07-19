import { DataTypes, Model } from "sequelize";
import { sequelize } from "../modules/Sequelize";


interface UserAttributes {
	id: number;
	name: string;
	balance: number;
  }

class User extends Model<UserAttributes> {
	declare id: number;
	declare name: string;
	declare balance: number;
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		balance: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	// Options
	{
		sequelize,
		tableName: "Users",
		timestamps: false,
	});

export default User;