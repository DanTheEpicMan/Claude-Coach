import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button"
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default async function() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user || error) { //don't think this can ever be reached because non logged-in users get redirected from this page.
        throw new Error("Authentication Required: No active user session found.");
    }




    return (
        <div className="pageFormat">
            <div>
                <p className="groupHeader">Account Details</p>
                <div className="dividerLineDiv"/>
                <p>Logged in as: <strong>{user.email}</strong></p>
                <p>User ID is: <code>{user.id}</code></p>
            </div>

            <div>
                <p className="groupHeader">Settings</p>
                <div className="dividerLineDiv"/>
                <p>Bla Bla, some configurations would like also go here, but no really cares</p>
            </div>

            <div>
                <p className="groupHeader">Account</p>
                <div className="dividerLineDiv"/>
                <LogoutButton />
            </div>

            <div>
                <Link href="/auth/forgot-password" passHref>
                    <Button variant="destructive">Reset Password</Button>
                </Link>
            </div>
        </div>
    )
}