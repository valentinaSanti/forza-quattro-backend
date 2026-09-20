import { User } from "./User";
import { Match } from "./Match";
import { Move } from "./Move";

//Un utente può giocare molte partite come player 1
User.hasMany(Match, {foreignKey: "playerOneId", as: "matchesAsPlayerOne"});
Match.belongsTo(User, { foreignKey: "playerOneId", as: "playerOne"});

//Un utente può giocare molte partite come player 2
User.hasMany(Match, {foreignKey: "playerTwoId", as: "matchesAsPlayerTwo"});
Match.belongsTo(User, { foreignKey: "playerTwoId", as: "playerTwo"});

//Una partita ha molte mosse
Match.hasMany(Move, {foreignKey:"matchId", as: "moves"});
Move.belongsTo(Match,{foreignKey:"matchId", as: "match"});

//Un utente può fare molte mosse
User.hasMany(Move, {foreignKey:"playerId", as:"moves"});
Move.belongsTo(User, {foreignKey: "playerId", as: "player"});

export{User, Match, Move};