"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import * as Sentry from "@sentry/nextjs";

const API_URL = process.env.API_URL;

async function logger(res, data) {
    if (!res.ok) {
        Sentry.logger.error(`API Error: ${res.status} on ${res.url}`, {
            statusCode: res.status,
            response: data,
        });
    }
}

async function addCookie(access_token) {
    const cookieStore = await cookies();
    cookieStore.set("token", access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1800,
    });
}

async function deleteCookie() {
    const cookieStore = await cookies();
    try {
        cookieStore.delete("token");
    } catch {}
}

async function getAccessToken() {
    const cookieStore = await cookies();

    return cookieStore.get("token").value;
}

async function sendOTP(emailID) {
    try {
        const url = `${API_URL}/login/send-otp/`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: emailID }),
        });
        const result = await response.json();
        if (!response.ok) {
            await logger(response, result);
            //Status Error
            return `${result.detail}, Please Refresh and try again!`;
        }
        return "Success";
    } catch (error) {
        throw new Error("BACKEND DOWN");
    }
}

async function verifyOTP(otp, emailID) {
    let response;
    try {
        const url = `${API_URL}/login/verify-otp/`;

        response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ otp: otp, email: emailID }),
        });
    } catch (error) {
        throw new Error("BACKEND DOWN");
    }
    const result = await response.json();
    if (!response.ok) {
        await logger(response, result);

        throw new Error(`Error: ${result.detail}, Please Check Again!`);
    }
    result.access_token !== undefined
        ? await addCookie(result.access_token)
        : null;
    return result.detail;
}

async function verifyOTPFinal(
    otp,
    emailID,
    username,
    promotional_optin,
    avatarStyle,
) {
    let response;
    try {
        const url = `${API_URL}/login/verify-otp/final/`;

        response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                otp: otp,
                email: emailID,
                username: username,
                promotional_optin: promotional_optin,
                avatar_style: avatarStyle,
            }),
        });
    } catch (error) {
        throw new Error(error.message);
    }
    const result = await response.json();
    if (!response.ok) {
        await logger(response, result);
        //Status Error
        throw new Error(`Error: ${result.detail}, Please Refresh!`);
    }
    result.access_token !== undefined
        ? await addCookie(result.access_token)
        : null;
    return "Success";
}

async function isAuthenticated() {
    //console.log("auth");
    const cookieStore = await cookies();
    try {
        const secret = new TextEncoder().encode(process.env.APP_SECRET_KEY);
        const payload = await jwtVerify(
            cookieStore.get("token").value,
            secret,
            { algorithms: ["HS256"] },
        );
        return payload.sub !== null;
    } catch (e) {
        return false;
    }
}
export {
    addCookie,
    deleteCookie,
    getAccessToken,
    sendOTP,
    verifyOTP,
    verifyOTPFinal,
    isAuthenticated,
};
