import { IDao } from "./IDao";
import { Match } from "../models";
import { Op, Transaction} from "sequelize";
import { MatchStatus } from "../enum/matchStatus";
import { MatchCreationAttributes } from "../models/Match";

// DAO per il match con implementazione funzioni generiche e specifiche per il match
export class MatchDao implements IDao<Match>{
    async create(item: MatchCreationAttributes, transaction?:Transaction): Promise<Match> {
        return await Match.create(item, {transaction});
    }
    async read(id: number, transaction?:Transaction): Promise<Match | null> {
        return await Match.findByPk(id, {transaction});
    }
    
    async readAll(): Promise<Match[]> {
        return await Match.findAll();
    }
    
    async update(item: Match, transaction?:Transaction): Promise<Match | null> {
        return await item.save({transaction});
    }
    
    async delete(item: Match, transaction?:Transaction): Promise<void> {
        await item.destroy({transaction});
    } 
    
    async findActiveMatchByUser(userId:string): Promise<Match|null>{
        return await Match.findOne({
            where:{
                status:MatchStatus.ACTIVE,
                [Op.or]: [{playerOneId:userId},{playerTwoId: userId}],
            },
        });
    }

    async findAllByUser(userId:string): Promise<Match[]>{
        return await Match.findAll({
            where: {[Op.or]: [{playerOneId:userId}, {playerTwoId: userId}]},
        });
    }        
}