"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ErrorBanner } from "@/components/ErrorBanner";
import { Field } from "@/components/Field";
import { Button } from "@/components/ui/button";
import type { NewAccountState } from "./new-account-state";
import { initialNewAccountState } from "./new-account-state";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Opening account..." : "Open account"}
    </Button>
  );
}

export function NewAccountForm({ action }: { action: (previousState: NewAccountState, formData: FormData) => Promise<NewAccountState> }) {
  const [state, formAction] = useActionState(action, initialNewAccountState);

  return (
    <form action={formAction} className="grid gap-6">
      {state.formError ?
        <ErrorBanner message={state.formError} />
      : null}
      <Field name="customerNik" label="NIK" inputMode="numeric" placeholder="3171012345670004" error={state.fieldErrors.customerNik} />
      <Field name="customerName" label="Customer name" placeholder="Customer name" error={state.fieldErrors.customerName} />
      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
