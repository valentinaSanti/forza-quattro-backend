import PDFDocument from "pdfkit";
import { Response } from "express"; //necessario per scrivere il PDF nella risposta
import { Move } from "../models";

// definizione di una funzione che permette 
// di scaricare in formato PDF lo storico delle mosse
export const generateMoveHistoryPDF = (moves: Move[], matchId: number, res: Response):void => {
    //creazione istanza di documento PDF
    const doc = new PDFDocument({margin: 40});

    //definizione di due header HTTP
    res.setHeader("Content- Type", "application/pdf"); //descrive il contenuto inviato come PDF
    res.setHeader("Content-Disposition", `attachment; filename=match-${matchId}-history.pdf`);
    // segnaliamo al client di trattare il contenuto come un file da scaricare suggerendo il nome del file 

    doc.pipe(res);//collego il flusso di dati binari alla risposta HTTP
    doc.fontSize(18).text(`Storico mosse - Partita #${matchId}`, {align:"center"}); //titolo PDF
    doc.moveDown(); // sposto il cursore di una riga

    moves.forEach((move,index)=>{
        const playerLabel = (move as any).player?.email ?? move.playerId;
        doc.fontSize(12).text(
            `${index + 1}.  Colonna: ${move.column} | Giovatore: ${playerLabel} | Data: ${move.createdAt.toISOString()}`
        );
    });

    //contenuto del file se non ci sono mosse nel periodo selezionato
    if (moves.length === 0){
        doc.fontSize(12).text(`Nessuna mossa trovata per il periodo selezionato.`);
    }

    doc.end();
}; 