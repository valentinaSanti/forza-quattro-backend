import app from './app';
import { sequelize } from './db/database';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connessione al DB stabilità con successo');

        app.listen(PORT, () =>{
            console.log(`Server avviato sulla porta ${PORT}`);
        });
    } catch (error) {
        console.error('Errore di connessione al database:', error);
    }

};

startServer();
