export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: "",
            },
        ],
        sitemap: [
            "https://nsuthive.com/sitemap.xml",
            "https://nsuthive.com/professors/sitemap.xml",
        ],
    };
}
