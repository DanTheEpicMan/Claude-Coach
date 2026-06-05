import { redirect } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {Suspense} from "react";

async function RedirectIfLoggedIn() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (user) {
        redirect("/dashboard");
    }

    return null;
}

export default function Home() {
    return(
        <div className="pageFormat">
            <Suspense fallback={null}>
                <RedirectIfLoggedIn />
            </Suspense>

            <h1>Join this super cool website</h1>
            <p>Consider making an account</p>

            <div className="flex gap-x-5">
                <Link href="/auth/sign-up" passHref>
                    <Button variant="default">SignUp</Button>
                </Link>

                <Link href="/auth/login" passHref>
                    <Button variant="secondary">Login</Button>
                </Link>
            </div>
        </div>
    )
}
