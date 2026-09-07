import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * One input, its label, its hint and its error, in one place — built on the
 * shadcn Input and Label primitives rather than a raw <input>.
 *
 * Every form field in a banking screen needs the same four things. Writing
 * them once means the error is never rendered in a different colour on a
 * different screen, and the aria wiring is never forgotten on the screen
 * nobody reviewed.
 */
export function Field({
  name,
  label,
  hint,
  error,
  ...rest
}: {
  name: string;
  label: string;
  hint?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1">
      <Label htmlFor={name} className="text-black">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        {...rest}
        className="text-black placeholder:text-gray-500"
      />
      {error ?
        <span id={`${name}-error`} className="block text-sm font-bold text-black">
          {error}
        </span>
      : hint ?
        <span className="block text-sm text-black">{hint}</span>
      : null}
    </div>
  );
}
