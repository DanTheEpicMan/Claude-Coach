
import Link from "next/link";
import {Suspense} from "react";
import {getWorkoutDays} from "@/app/workout/dbactions";
import { Button } from "@/components/ui/button";

export default async function workout() {

    return (
        <div className="pageFormat">

            <p className="groupHeader">Create a new workout or edit an existing one</p>
            <Link href="/workout/gymui/" passHref>
                <Button variant="default">Create New Workout</Button>
            </Link>

            <div className="dividerLineDiv"/>

            {/*TODO: Make the UL be a form that has buttons that passes arguments to a redirect function*/}
            <Suspense fallback={<p>Loading...</p>}>
                <ul>
                    {(await getWorkoutDays()).map((day, index) => (

                        <li key={index}>{day.id} {day.workout_date}</li>
                    ))}
                </ul>
            </Suspense>

        </div>
    );
}