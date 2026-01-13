import Search from "../components/SearchBar";
import { getProfessors, getDepartments } from "../lib/api";

export const metadata = {
    title: "NSUT Hive — View All Professors",
    description: `Browse all professors at NSUT and explore anonymous student reviews and academic insights 
    based on teaching effectiveness, grading fairness, attendance policy, and ease of workload.`,
    openGraph: {
        images: "https://cdn.nsuthive.com/NH_NOBG_1024.png",
    },
};

export default async function Professors() {
    const profData = await getProfessors();
    const deptData = await getDepartments();

    //console.log(deptData);
    //console.log(profData);
    return (
        <>
            <Search profData={profData} deptData={deptData}></Search>
        </>
    );
}
