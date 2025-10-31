"use client";

import standaloneSignIn from "@/actions/standalone/standaloneSignIn";
import React, { useState } from "react";

export default function SignIn() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!username.trim() || !password) {
            setError("Please enter both username and password.");
            return;
        }

        setLoading(true);
        try {
           const result = await standaloneSignIn({email: username, password: password});
           if (result) {
            window.location.reload();
           }
        } catch (err) {
            setError("unexpected error occurred: " + err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 480, margin: "48px auto", padding: 20, backgroundColor: "#fff" }}>
            <h2>Sign in</h2>
            <p>Enter your username and password to continue.</p>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
                <label style={{ display: "block" }}>
                    <div style={{ marginBottom: 6 }}>Email</div>
                    <input
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="email"
                        disabled={loading}
                        style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
                    />
                </label>

                <label style={{ display: "block" }}>
                    <div style={{ marginBottom: 6 }}>Password</div>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        disabled={loading}
                        style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
                    />
                </label>

                {error && (
                    <div role="alert" style={{ color: "#b91c1c", marginBottom: 12 }}>
                        {error}
                    </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button type="submit" disabled={loading} style={{ padding: "8px 12px" }}>
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </div>
            </form>
        </div>
    );
}