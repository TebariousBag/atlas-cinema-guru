import { auth, signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";

export default async function Header() {
  const session = await auth();
  const userEmail = session?.user?.email;

  return (
    <header
      className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3"
      suppressHydrationWarning
    >
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.png" alt="Logo" width={28} height={28} />
        <span className="text-sm font-medium">Cinema Guru</span>
      </Link>

      <div className="flex items-center gap-4 text-sm">
        {userEmail ? <span className="opacity-90">{userEmail}</span> : null}
        {session ? (
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button
              type="submit"
              className="rounded bg-white/10 px-3 py-1.5 font-medium hover:bg-white/20"
            >
              Log out
            </button>
          </form>
        ) : null}
      </div>
    </header>
  );
}
