import { auth, signOut } from "@/auth";
import Link from "next/link";
import { IoFilmOutline } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";

export default async function Header() {
  const session = await auth();
  const userEmail = session?.user?.email;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex h-[52px] items-center justify-between bg-[#1ED2AF] px-4 text-[#00003c]"
      suppressHydrationWarning
    >
      <Link href="/" className="flex items-center gap-2">
        <IoFilmOutline className="h-7 w-7" />
        <span className="text-base font-semibold text-[#00003c]">
          Cinema Guru
        </span>
      </Link>

      <div className="flex items-center gap-4 text-sm">
        {userEmail ? (
          <span className="font-medium">Welcome, {userEmail}</span>
        ) : null}
        {session ? (
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-1.5 font-medium text-[#00003c] hover:opacity-80"
            >
              <TbLogout className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </form>
        ) : null}
      </div>
    </header>
  );
}
