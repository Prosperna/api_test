import jwt from 'jsonwebtoken';

const SECRET = 'secret';

// generate access token
export const generateToken = (data: any)=>{
    return jwt.sign({ data }, SECRET,{ expiresIn: '1h' });
};

// validate access token
export const verifyToken = (token: string) => {
    return jwt.verify(token,SECRET,{ complete: true });
};

// decode access token
export const decodeToken = (token: string) => {
    return jwt.decode(token,{json: true});
};