export const dynamic = "force-static";

export const metadata = {
  title: "Not authorized",
  description: "You do not have permission to view this page.",
  robots: { index: false, follow: false },
};

export default function NotAuthorizedPage() {
  return (
    <main className="min-h-[60vh] grid place-items-center px-6 py-20">
      <div className="max-w-md text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[--aj-primary]/10">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8"
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeWidth={1.5} d="M16.5 10.5V7.875a4.5 4.5 0 10-9 0V10.5m-.75 0h10.5a1.5 1.5 0 011.5 1.5v7.5a1.5 1.5 0 01-1.5 1.5H6.75a1.5 1.5 0 01-1.5-1.5V12a1.5 1.5 0 011.5-1.5z" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight">Not authorized</h1>

        <p className="text-muted-foreground">
          Your account is signed in, but it doesn't have access to this area.
          If you believe this is a mistake, contact the site owner.
        </p>

        <div className="flex items-center justify-center gap-3">
          <a href="/portal" className="rounded-xl px-4 py-2 border">Back to Portal</a>
          <a href="/login?next=/portal/admin" className="rounded-xl px-4 py-2 text-black"
             style={{ backgroundColor: "var(--aj-primary, #E8FF5A)" }}>
            Switch Account
          </a>
        </div>
      </div>
      <style>{`:root{--aj-primary:#E8FF5A}`}</style>
    </main>
  );
}