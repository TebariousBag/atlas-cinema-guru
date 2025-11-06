import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-lg bg-white/5 p-6 shadow-xl">
        <h1 className="mb-6 text-center text-2xl font-semibold">Sign in</h1>
        <form
          action={async () => {
            "use server";
            await signIn("github");
          }}
        >
          <button
            type="submit"
            className="w-full rounded bg-[#1ED2AF] px-4 py-2 font-medium text-white hover:opacity-90"
          >
            Continue with GitHub
          </button>
        </form>
      </div>
    </div>
  );
}
