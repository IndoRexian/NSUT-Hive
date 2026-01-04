import Search from "../components/SearchBar";

import { getProfessors, getDepartments } from "../lib/api";

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
