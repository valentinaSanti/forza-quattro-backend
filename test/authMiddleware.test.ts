import { Response, NextFunction } from "express";
import {AuthRequest, authenticateJWT, requireAdmin} from "../src/middlewares/authMiddleware";
import {UnauthorizedError,ForbiddenError} from "../src/utils/errors";
import * as authHelper from "../src/utils/auth.helper";
import {UserRole} from "../src/enum/userRole";

//Mock del modulo auth.helper, in questo modo riusciamo ad isolare il middleware authenticateJWT 
// dalla reale logica di verifica dei token RS256, evitando la necessità di usare 
// chiavi JWT durante i test unitari
jest.mock("../src/utils/auth.helper");


//suite di test dedicata al middleware authenticateJWT. Al suo interno viene verificato la richiesta
//venga corretamente bloccata con UnauthorizedError in assenza dell'header Autorization o in presenza 
// di token non valido/scaduto, e che la richiesta prosegua correttamente popolando req.user 
// se il token è valido
describe("Auth Middleware - authenticateJWT", ()=>{
    let mockRequest: Partial<AuthRequest>;
    let mockResponse: Partial<Response>;
    let next: jest.Mock;

    beforeEach(()=>{
        mockRequest = {};
        mockResponse = {};
        next = jest.fn();
        jest.clearAllMocks(); // andiamo a pulire lo stato dei mock dai test precedenti
    });

    //Il test verifica che il middleware deleghi un errore UNAUTHORIZED al middleware 
    // globale quando l'header Authorization è assente
    it("dovrebbe chiamare next con UnauthorizedError se l'header Authorization manca", ()=>{
        authenticateJWT(mockRequest as AuthRequest, mockResponse as Response, next as NextFunction);
        expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    //Il test verifica che il middleware deleghi un errore UNAUTHORIZED al middleware 
    // globale quando il token è presente ma non valido
    it("dovrebbe chiamare next UnauthorizedError se il token è presente ma non valido", ()=>{
        mockRequest.headers={authorization: "Bearer token-non-valido"};
        (authHelper.verifyToken as jest.Mock).mockImplementation(()=>{
            throw new Error("invalid signature");
        })
        authenticateJWT(mockRequest as AuthRequest, mockResponse as Response, next as NextFunction);
        expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    //Il test verifica che il middleware popoli user se il token è valido
    it("dovrebbe popolare req.user e chiamare next() senza errori se il token è valido", ()=>{
        mockRequest.headers={authorization: "Bearer token-valido"};
        const decodedPayload = {id:"uuid-123", email:"mario.rossi@example.it",role: UserRole.USER};
        (authHelper.verifyToken as jest.Mock).mockReturnValue(decodedPayload);

        authenticateJWT(mockRequest as AuthRequest, mockResponse as Response, next as NextFunction);
        expect(mockRequest.user).toEqual(decodedPayload);
        expect(next).toHaveBeenCalledWith(); //mi aspetto di avere una chiamata senza errori
    });
});


//suite di test dedicata al middleware requireAdmin. Al suo interno viene verificato che l'accesso 
// venga consentito solo agli utenti con ruolo ADMIN, bloccando con un errore ForbiddenError
//qualsiasi altra richiesta utenticata ma priva dei privilegi necessari
describe ("AuthMiddleware - requireAdmin", ()=>{
    let mockRequest: Partial<AuthRequest>;
    let mockResponse: Partial<Response>;
    let next: jest.Mock;

    beforeEach(()=>{
        mockRequest = {headers: {}};
        mockResponse = {};
        next = jest.fn();
    });

    //Il test verifica che il middleware deleghi un errore Forbidden al middleware 
    // globale quando l'utente non ha il ruolo di ADMIN
    it("dovrebbe chiamare next con ForbiddenError se l'utente non ha ruolo ADMIN", ()=>{
        mockRequest.user={id:"uuid-1", email:"mario.rossi@example.it", role:UserRole.USER};
        requireAdmin(mockRequest as AuthRequest, mockResponse as Response, next as NextFunction);
        expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });

    //Il test verifica che il middleware chiami next senza errori se 
    // l'utente ha il ruolo di ADMIN
    it("dovrebbe chiamare next() senza errori se l'utente  ha ruolo ADMIN", ()=>{
        mockRequest.user={id:"uuid-2", email:"admin@example.it", role:UserRole.ADMIN};
        requireAdmin(mockRequest as AuthRequest, mockResponse as Response, next as NextFunction);
        expect(next).toHaveBeenCalledWith();
    });

});

//suite di test dedicata al middleware forbiddenAdmin. Al suo interno viene verificato che l'accesso 
// venga bloccato  agli utenti con ruolo ADMIN con un errore ForbiddenError
//mentre un utente con ruolo USER possa proseguire
describe ("AuthMiddleware - forbiddenAdmin", ()=>{
    let mockRequest: Partial<AuthRequest>;
    let mockResponse: Partial<Response>;
    let next: jest.Mock;

    beforeEach(()=>{
        mockRequest = {headers: {}};
        mockResponse = {};
        next = jest.fn();
    });

    //Il test verifica che il middleware deleghi un errore Forbidden al middleware 
    // globale quando l'utente ha il ruolo di ADMIN
    it("dovrebbe chiamare next con ForbiddenError se l'utente ha ruolo ADMIN", ()=>{
        mockRequest.user={id:"uuid-admin", email:"admin@example.it", role:UserRole.ADMIN};
        requireAdmin(mockRequest as AuthRequest, mockResponse as Response, next as NextFunction);
        expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });

    //Il test verifica che il middleware chiami next senza errori se 
    // l'utente ha il ruolo di USER
    it("dovrebbe chiamare next() senza errori se l'utente  ha ruolo USER", ()=>{
        mockRequest.user={id:"uuid-1", email:"mario.rossi@example.it", role:UserRole.USER};;
        requireAdmin(mockRequest as AuthRequest, mockResponse as Response, next as NextFunction);
        expect(next).toHaveBeenCalledWith();
    });

});