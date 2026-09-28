import { IDao } from "./IDao";
import { User } from "../models";
import { Transaction } from "sequelize";
import { UserRole } from "../enum/userRole";

// DAO per il l'user con implementazione funzioni generiche e specifiche per l'user
export class UserDAo implements IDao<User>{
    async create(item: User, transaction?:Transaction): Promise<User> {
        return await User.create(item, {transaction});
    }

    async read(id: string, transaction?:Transaction): Promise<User | null> {
        return await User.findByPk(id, {transaction});
    }

    async readAll(): Promise<User[]> {
        return await User.findAll();
    }

    async readAllRealUser(): Promise<User[]> {
        return await User.findAll({where: {isAI:false, role:UserRole.USER}});
    }

    async update(item: User, transaction?:Transaction): Promise<User | null> {
        return await item.save({transaction});
    }

    async delete(item: User, transaction?:Transaction): Promise<void> {
        await item.destroy({transaction});
    }

    async findByEmail(email:string):Promise<User|null>{
        return await User.findOne({where:{email}});
    }

    async findAI(): Promise<User|null>{
        return await User.findOne({where:{isAI:true}});
    }

}