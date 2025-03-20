"use client";

import { useRouter } from "next/navigation";

const profiles = () => {
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
export default profiles;