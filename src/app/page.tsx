import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Civy</h1>
        <p className="text-muted-foreground">Resume Builder</p>
        <Button asChild size="lg">
          <Link href="/editor/demo">Open Editor</Link>
        </Button>
      </div>
    </div>
  );
}
