import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Resume not found</h2>
        <p className="text-muted-foreground">This resume does not exist or has been removed.</p>
        <Link href="/dashboard" className="inline-block rounded-lg bg-primary text-primary-foreground px-6 py-2 text-sm font-medium">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
