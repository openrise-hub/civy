"use client";

export default function GlobalError() {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Something went wrong</h1>
          <p className="text-muted-foreground">An unexpected error occurred. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-primary text-primary-foreground px-6 py-2 text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </body>
    </html>
  );
}
