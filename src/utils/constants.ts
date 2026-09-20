//costanti relativa ai costi
export const MATCH_COSTS ={
    UVU_CREATION: 0.45, //costo avvio match user vs user
    VS_AI_CREATION: 0.75, //costo avvio match contro AI
    MOVE_COST:0.05
} as const;

//costanti relative a JWT
export const JWT_CONFIG = {
    EXPIRES_IN:"1h",
    ALGORITHM: "RS256" as const,
};

export const SALT = 10;

export const TOKEN_USER = 20;