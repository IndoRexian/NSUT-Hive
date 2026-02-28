import Search from "../components/SearchBar";
import { getProfessors, getDepartments } from "../lib/api";

export const metadata = {
    title: "NSUT Hive — View All Professors",
    description: `Browse all professors at NSUT and explore anonymous student reviews and academic insights 
    based on teaching effectiveness, grading fairness, attendance policy, and ease of workload.`,
    openGraph: {
        title: "NSUT Hive — View All Professors",
        description: `Browse all professors at NSUT and explore anonymous student reviews and academic insights 
    based on teaching effectiveness, grading fairness, attendance policy, and ease of workload.`,
        images: [
            {
                url: "https://" + process.env.CDN_LINK + "/NH_NOBG_1024.png",
                height: 512,
                width: 512,
                alt: "Logo of NSUT Hive",
            },
        ],
        type: "website",
    },
};

export default async function Professors() {
    const profData = await getProfessors();
    const deptData = await getDepartments();

    return (
        <>
            <Search profData={profData} deptData={deptData}></Search>
        </>
    );
}
