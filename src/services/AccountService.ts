"use client";
import { IUserInfo } from "@/state/AppContext";
import axios from "axios";
import { IResultObject } from "./IResultObject";


export default class AccountService {
    private constructor() {

    }
    

    private static httpClient = axios.create({
        baseURL: 'https://smarty.akaver.com/api/v1/identity/account/',
    });

    static async login(email: string, pwd: string): Promise<IResultObject<IUserInfo>> {
        const loginData = {
            email: email,
            password: pwd
        };
        try {
            const response = await AccountService.httpClient.post<IUserInfo>("login", loginData);
            if (response.status < 300) {
                return { data: response.data };
            }
            return { errors: [`${response.status} ${response.statusText}`] };
        } catch (error: any) {
            return { errors: [JSON.stringify(error)] };
        }
    }

    static async register(userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }): Promise<IResultObject<IUserInfo>> {
        try {
            const response = await AccountService.httpClient.post<IUserInfo>("register", userData);
            if (response.status < 300) {
                return { data: response.data };
            }
            return { errors: [`${response.status} ${response.statusText}`] };
        } catch (error: any) {
            return { errors: [JSON.stringify(error)] };
        }
    }
}