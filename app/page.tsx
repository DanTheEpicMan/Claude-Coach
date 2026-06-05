import { redirect } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {createClient} from "@/lib/supabase/client";
import Link from "next/link";


export default async function Home() {
  // redirect people who are signed into to the dashboard
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  //Signed in
  if (!(error || !user)) {
    redirect("/Dashboard");
  }

  //What users who are not sigend in
  return(
      <div>
        <h1>Join this super cool website</h1>
        <p>Consider making an account</p>

          <Link href="/auth/sign-up" passHref>
              <Button variant="default">SignUp</Button>
          </Link>

          <Link href="/auth/login" passHref>
              <Button variant="secondary">Login</Button>
          </Link>
      </div>
  )
}
