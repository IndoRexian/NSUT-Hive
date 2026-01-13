import { getProfessors } from "../lib/api";

export default async function sitemap(props) {
    const profData = await getProfessors();
    return profData.map((prof) => ({
        url: `https://nsuthive.com/professors/${prof.public_id}`,
        //lastModified: product.date,
        changeFrequency: "weekly",
        priority: 0.8,
    }));
}
