import { getProfessors } from "../lib/api";
export const dynamic = "force-dynamic";
export default async function sitemap(props) {
    try {
        const profData = await getProfessors();

        if (!profData || !Array.isArray(profData)) {
            return [];
        }

        return profData.map((prof) => ({
            url: `https://nsuthive.com/professors/${prof.public_id}`,
            changeFrequency: "weekly",
            priority: 0.8,
        }));
    } catch (error) {
        console.error("Sitemap generation failed:", error);
        return [];
    }
}
