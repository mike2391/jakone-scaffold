import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewAccountForm } from "./NewAccountForm";
import { createAccount } from "./actions";

/**
 * STEP 8 — open an account.
 *
 * The second Server Action of the day, and the one with the trap in it. Read
 * the note on redirect() in WALKTHROUGH.md before you write the catch block.
 */
export default function NewAccountPage() {
  const action = createAccount.bind(null);

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Open an account</CardTitle>
        </CardHeader>
        <CardContent>
          <NewAccountForm action={action} />
        </CardContent>
      </Card>
    </div>
  );
}
