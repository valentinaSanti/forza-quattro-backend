import { Transaction } from "sequelize";
export interface IDao<T, K = number | string>{
    create(item: T, transaction?:Transaction): Promise<T>;
    read(id: K, transaction?:Transaction): Promise<T | null>; //il null viene restituito se non trovo id
    readAll(): Promise<T[]>; 
    update(item: T, transaction?:Transaction): Promise<T | null>;
    delete(item:T, transaction?:Transaction): Promise<void>;
}
