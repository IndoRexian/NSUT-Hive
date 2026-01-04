export default function manifest() {
    return {
        name: "NSUT Students Hub",
        short_name: "NSH",
        description: "One Stop location for all things NSUT",
        start_url: "/",
        display: "standalone",
        background_color: "#1a1a1a",
        theme_color: "#1ac531",
        icons: [
            {
                src: "/NSH.ico",
                sizes: "any",
                type: "image/x-icon",
            },
        ],
    };
}
