import { createContext } from "react";

export interface IUserInfo {
    "jwt": string,
    "refreshToken": string
}


export interface IUserContext {
    userInfo: IUserInfo | null,
    setUserInfo: (userInfo: IUserInfo | null) => void
}


export const AppContext = createContext<IUserContext | null>(null); 