import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <Card className="border-dashed bg-transparent text-center shadow-none">
      <CardContent className="py-10">
        <p className="font-bold">{title}</p>
        {hint ? <p className="mt-2 text-sm text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
