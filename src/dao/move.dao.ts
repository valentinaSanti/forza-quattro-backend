import { IDao } from "./IDao";
import { Move} from "../models";
import { Op, Transaction } from "sequelize";

export class MoveDAo implements IDao<Move>{
    async create(item: Move, transaction?:Transaction): Promise<Move> {
        return await Move.create(item, {transaction});
    }

    async read(id: number, transaction?:Transaction): Promise<Move | null> {
        return await Move.findByPk(id, {transaction});
    }

    async readAll(): Promise<Move[]> {
        return await Move.findAll();
    }

    async update(item: Move, transaction?:Transaction): Promise<Move | null> {
        return await item.save({transaction});
    }

    async delete(item: Move, transaction?:Transaction): Promise<void> {
        await item.destroy({transaction});
    }

    async findByMatch(matchId:number):Promise<Move[]>{
        return await Move.findAll({where:{matchId}, order:[["createdAt", "ASC"]]});
    }

    async findLastByMatch(matchId:number):Promise<Move | null>{
        return await Move.findOne({where:{matchId}, order:[["createdAt", "DESC"]]});
    }

    async findByMatchWithDateFilter(matchId:number, from?:Date, to?:Date): Promise<Move[]>{
        const whereCondition: any = {matchId};
        if (from || to){
            whereCondition.createdAt = {};
            if(from){
                whereCondition.createdAt[Op.gte] = from;
            }
            if(to){
                whereCondition.createdAt[Op.lte] = to;
            }
        }
        return await Move.findAll({
            where: whereCondition,
            order:[['createdAt', 'ASC']],
            include:[{association: "player", attributes:["id", "email"]}],
        });
    }

}