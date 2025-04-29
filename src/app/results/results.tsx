// src/app/components/Register.tsx

"use client";
import { AppContext, IUserInfo } from "@/state/AppContext";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import AccountService from "@/services/AccountService";

export default function Register() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [validationError, setValidationError] = useState("");
    const { setUserInfo } = useContext(AppContext)!;

    const handleRegister = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setValidationError("Passwords do not match");
            return;
        }
    
        try {
            const response = await AccountService.register({
                email,
                password,
                firstName,
                lastName
            });
    
            if (response.data) {
                console.log("Registration successful:", response.data);
                setUserInfo({
                    jwt: response.data.jwt,
                    refreshToken: response.data.refreshToken,
                });
                router.push("/");
            } else {
                console.error("Registration failed:", response.errors);
                setValidationError("Registration failed. Please try again later.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            setValidationError("Registration failed. Please try again later.");
        }
    };
    
    return (
        <div className="row">
            <div className="col-md-4">
                <h1>Register</h1>
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="firstName" className="form-label">First Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lastName" className="form-label">Last Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    {validationError && (
                        <div className="alert alert-danger" role="alert">
                            {validationError}
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary">Register</button>
                </form>
            </div>
        </div>
    );
}
