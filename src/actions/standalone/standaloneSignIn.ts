"use server";


import { ApiResponse, SignInPost } from "@/types/api";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiPost } from "@/lib/apiClient";
import { cookies } from "next/headers";

interface SignInResponse<T> {
    message: string;
    data: T;
}

const standaloneSignIn = async (
    payload: SignInPost
): Promise<boolean> => {
    const response = await apiPost<ApiResponse<SignInResponse>, SignInPost>(
        API_ROUTES.signIn,
        payload
    );

    const token = response.data?.access_token;

    console.log(token);

    if (!token) {
        return false;
    }

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60,
    });

    return true;
};

export default standaloneSignIn;
