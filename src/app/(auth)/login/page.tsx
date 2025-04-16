import * as React from "react"
import Button from "@/components/button/Button";

export default function LoginForm() {
    return (
        <section className="auth-container">
            <form className="auth-form">
                <img src="/public/xlogo.png" alt="logo" className="auth-logo" />
                <h2 className="auth-heading">Login</h2>
                <input
                    type="text"
                    placeholder="Enter your username"
                    className="auth-input"
                />
                <Button variant="primary">Login</Button>
            </form>
        </section>
    );
};

