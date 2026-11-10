import { redirect } from "next/navigation";
import { MeClient } from "@/components/MeClient";
import { getUserFromSession } from "@/lib/auth";

export default async function MePage() {
    const user = await getUserFromSession();
    if (!user) {
        redirect("/");
    }

    return <MeClient />;
}
