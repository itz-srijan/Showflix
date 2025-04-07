"use client";

import { useRouter } from "next/navigation";

const Profiles = () => {
    const router = useRouter();
    return (
        <div>
            <p className="text-black text-4xl">Profiles</p>

            <div>
                <div onClick={() => router.push('/')}>who is watching</div>
            </div>
        </div>
    );
}
export default Profiles;