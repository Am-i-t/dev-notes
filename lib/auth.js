
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const COOKIE_NAME="auth-token";

function getJwtSecret(){
    const secret = process.env.JWT_SECRET;

    if(!secret){
        throw new Error("JWT_SECRET is not configured");
    }

    return secret;
}

export async function createSession(userId){

    const payload ={
        id : userId.toString()
    }
  
    const token =  jwt.sign(payload,getJwtSecret(),{expiresIn:24*60*60});

   (await cookies()).set(COOKIE_NAME,token,{
     httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 86400,
    })
}


export async function getCurrentUser(){
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if(!token){
        return null;
    }

    try{
        const decoded = jwt.verify(token,getJwtSecret());

        if(typeof decoded==="string" || typeof decoded.id !=="string"){
      return null;
    }
        return{
            userId: decoded.id
        }

    }catch(error){
        return null;
    }
}

export async function deleteSession() {
  (await cookies()).delete(COOKIE_NAME);
}


