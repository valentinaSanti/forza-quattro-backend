import { Response, NextFunction } from "express";
import {checkTokenBalance} from "../src/middlewares/tokenMiddleware";
import {AuthRequest} from "../src/middlewares/authMiddleware";
import {UnauthorizedError, NotFoundError} from "../src/utils/errors";
import { UserDAo } from "../src/dao/user.dao";
import { MatchType } from "../src/enum/matchType";
import {  TOKEN_USER } from "../src/utils/constants";

//suite di test dedicata al middleware checkTokenBalance. Al suo interno viene verificato che il
//controllo dei token dell'utente blocchi corretamente le richieste quando l'utente non è autenticato, 
// non esiste nel db o non ha credito sufficiente per la creazione del match. 
// Il DAO UserDao viene mockato per isolare il middleware dalla reale connessione al database

//viene creata una versione fittizia della classe UserDao
jest.mock("../src/dao/user.dao");


describe("TokenMiddleware - checkTokenBalance", ()=>{
    let mockRequest: Partial<AuthRequest>;
    let mockResponse: Partial<Response>;
    let next: jest.Mock;

    beforeEach(()=>{
        mockRequest = {body: {}};
        mockResponse = {};
        next = jest.fn();
        jest.clearAllMocks(); // andiamo a pulire lo stato dei mock dai test precedenti

    });
    //Il test verifica che il middleware deleghi un errore UNAUTHORIZED al middleware 
    // globale quando req.user non è popolato
    it("dovrebbe chiamare next con UnauthorizedError se req.user non è popolato", async ()=>{
        mockRequest.user =undefined;

        await checkTokenBalance(mockRequest as AuthRequest, mockResponse as Response, next as NextFunction);
        expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    //Il test verifica che il middleware deleghi un errore NotFoundError al middleware 
    // globale quando l'utente non è presente nel database
    it("dovrebbe chiamare next con NotFoundError se l'utente non esiste nel DB", async ()=>{
        mockRequest.user ={id:"uuid-1"};
        (UserDAo.prototype.read as jest.Mock).mockResolvedValue(null);

        await checkTokenBalance(mockRequest as AuthRequest, mockResponse as Response, next as NextFunction);
        expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
    });

    //Il test verifica che il middleware deleghi un errore UNAUTHORIZED al middleware 
    // globale quando l'utente non ha credito sufficiente ad avviare una partita
    it("dovrebbe chiamare next con UnauthorizedError se l'utente non ha un credito sufficiente", async ()=>{
        mockRequest.user ={id:"uuid-1"};
        mockRequest.body={type:MatchType.VS_AI};
        (UserDAo.prototype.read as jest.Mock).mockResolvedValue({
            id:"uuid-1",
            tokens:0.1, // il valore è impostato volutamente inferiore al costo del match (0.75)
        });

        await checkTokenBalance(mockRequest as AuthRequest, mockResponse as Response, next as NextFunction);
        expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    //Il test verifica che il middleware chiami next se l'utente ha credito sufficiente
    it("dovrebbe chiamare next() se l'utente ha un credito sufficiente", async ()=>{
        mockRequest.user ={id:"uuid-1"};
        mockRequest.body={type:MatchType.VS_AI};
        (UserDAo.prototype.read as jest.Mock).mockResolvedValue({
            id:"uuid-1",
            tokens:TOKEN_USER, // il valore è impostato volutamente superiore al costo del match (0.75)
        });

        await checkTokenBalance(mockRequest as AuthRequest, mockResponse as Response, next as NextFunction);
        expect(next).toHaveBeenCalledWith();
    });   
});
