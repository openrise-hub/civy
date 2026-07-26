"use client";

export default function Error() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-muted-foreground">Failed to load this page.</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-primary text-primary-foreground px-6 py-2 text-sm font-medium"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
