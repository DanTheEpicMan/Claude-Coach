import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getWorkoutDays } from "@/app/workout/dbactions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

//read perams, if nothing in DB, then make new day, otherwise load one up
export default async function workout() {

    return (
        <div className="pageFormat">



        </div>
    );
}