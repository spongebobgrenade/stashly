import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">
        Stashly
      </h1>

      <p>
        Save anything with zero friction
      </p>

      <Link
        href="/login"
        className="px-4 py-2 rounded bg-black text-white"
      >
        Continue with Google
      </Link>
    </main>
  );
}