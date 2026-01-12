export default function manifest() {
    return {
        name: "NSUT Hive",
        short_name: "NH",
        description: "One Stop location for all things NSUT",
        start_url: "/",
        display: "standalone",
        background_color: "#1a1a1a",
        theme_color: "#1ac531",
        icons: [
            {
                src: "/NH.ico",
                sizes: "any",
                type: "image/x-icon",
            },
        ],
    };
}
