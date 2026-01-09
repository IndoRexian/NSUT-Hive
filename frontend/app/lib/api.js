"use server";
import { isAuthenticated } from "./auth";
import * as Sentry from "@sentry/nextjs";
import { cookies } from "next/headers";
import fetchIntercept from "fetch-intercept";

const API_URL = process.env.API_URL;

const unregister = fetchIntercept.register({
    request: function (url, config) {
        //Waiting for Refresh Token Implementation One Day
        return [url, config];
    },
});

async function logger(res, data) {
    if (!res.ok) {
        Sentry.logger.error(`API Error: ${res.status} on ${res.url}`, {
            statusCode: res.status,
            response: data,
        });
    }
}

async function getProfessors() {
    try {
        const res = await fetch(`${API_URL}/professors/`);
        const data = await res.json();
        await logger(res, data);
        return data;
    } catch (e) {
        throw new Error(e.message);
    }
}

async function getDepartments() {
    try {
        const res = await fetch(`${API_URL}/departments/`);

        const data = await res.json();
        await logger(res, data);
        return data;
    } catch (e) {
        throw new Error("BACKEND DOWN");
    }
}

async function getProfessorByPublicID(publicid) {
    try {
        const res = await fetch(`${API_URL}/professor/?publicid=${publicid}`);

        const data = await res.json();
        return data;
    } catch (e) {
        throw new Error("BACKEND DOWN");
    }
}

async function getUserData() {
    const ifAuthenticated = await isAuthenticated();
    if (ifAuthenticated !== true) {
        return { success: false, error: "unauthenticated" };
    }
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/get_user_by_id/`, {
            method: "GET",
            headers: {
                Cookie: cookieStore.toString(),
            },
        });
        if (res?.status === 401) {
            return { success: false, error: "unauthenticated" };
        }

        const data = await res.json();
        await logger(res, data);
        return data;
    } catch (e) {
        throw new Error("BACKEND DOWN");
    }
}

async function getReviewsOfProf(profID) {
    try {
        const res = await fetch(`${API_URL}/review/get/?profid=${profID}`);

        const data = await res.json();
        await logger(res, data);
        return data;
    } catch (e) {
        throw new Error("BACKEND DOWN");
    }
}

async function submitReview(profID, ratingsList, reviewText = null) {
    const ifAuthenticated = await isAuthenticated();
    if (ifAuthenticated !== true) {
        return { success: false, error: "unauthenticated" };
    }
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/review/add/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            body: JSON.stringify({
                professor_id: profID,
                CAT_1: ratingsList[0],
                CAT_2: ratingsList[1],
                CAT_3: ratingsList[2],
                CAT_4: ratingsList[3],
                review_text: reviewText,
            }),
        });
        if (res?.status === 401) {
            return { success: false, error: "unauthenticated" };
        }

        const data = await res.json();
        await logger(res, data);
        return data;
    } catch (e) {
        return { success: false, error: e.message };
    }
}

async function deleteReview(profID) {
    const ifAuthenticated = await isAuthenticated();
    if (ifAuthenticated !== true) {
        return { success: false, error: "unauthenticated" };
    }
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/review/delete/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            body: JSON.stringify({
                professor_id: profID,
            }),
        });
        if (res?.status === 401) {
            return { success: false, error: "unauthenticated" };
        }

        const data = await res.json();

        await logger(res, data);
        return data;
    } catch (e) {
        return { success: false, error: e.message };
    }
}

async function updateReview(profID, ratingsList, reviewText = null) {
    const ifAuthenticated = await isAuthenticated();
    if (ifAuthenticated !== true) {
        return { success: false, error: "unauthenticated" };
    }
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/review/update/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            body: JSON.stringify({
                professor_id: profID,
                CAT_1: ratingsList[0],
                CAT_2: ratingsList[1],
                CAT_3: ratingsList[2],
                CAT_4: ratingsList[3],
                review_text: reviewText,
            }),
        });
        if (res?.status === 401) {
            return { success: false, error: "unauthenticated" };
        }

        const data = await res.json();
        await logger(res, data);
        return data;
    } catch (e) {
        return { success: false, error: e.message };
    }
}

async function addReaction(review_id, state) {
    const ifAuthenticated = await isAuthenticated();
    if (ifAuthenticated !== true) {
        return { success: false, error: "unauthenticated" };
    }
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/review/reaction/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            body: JSON.stringify({
                review_id: review_id,
                state: state,
            }),
        });
        if (res?.status === 401) {
            return { success: false, error: "unauthenticated" };
        }

        const data = await res.json();
        await logger(res, data);
        //infoToast(data.detail);
        return data;
    } catch (e) {
        return { success: false, error: e.message };
    }
    //throw new Error("Not Logged In");
    //infoToast("Not Logged In");
}

async function deleteReaction(review_id, state) {
    const ifAuthenticated = await isAuthenticated();
    if (ifAuthenticated !== true) {
        return { success: false, error: "unauthenticated" };
    }
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/review/reaction/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            body: JSON.stringify({
                review_id: review_id,
                state: state,
            }),
        });
        if (res?.status === 401) {
            return { success: false, error: "unauthenticated" };
        }

        const data = await res.json();
        await logger(res, data);
        //infoToast(data.detail);
        return data;
    } catch (e) {
        return { success: false, error: e.message };
    }
    //throw new Error("Not Logged In");
    //infoToast("Not Logged In");
}

async function getUserReactions(profid) {
    const ifAuthenticated = await isAuthenticated();
    // if (ifAuthenticated !== true) {
    //     return { success: false, error: "unauthenticated" };
    // }

    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/review/reaction/getuser/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            body: JSON.stringify({
                profid: profid,
            }),
        });
        if (res?.status === 401 || res?.status === 404) {
            return [];
        }

        const data = await res.json();
        await logger(res, data);
        return data;
    } catch (e) {
        return { success: false, error: e.message };
    }

    //throw new Error("Not Logged In");
    //infoToast("Not Logged In");
}

export {
    getProfessors,
    getDepartments,
    getProfessorByPublicID,
    getUserData,
    getReviewsOfProf,
    submitReview,
    updateReview,
    deleteReview,
    addReaction,
    deleteReaction,
    getUserReactions,
};
