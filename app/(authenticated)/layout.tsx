import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

type Props = {
  children: React.ReactNode;
};

export default function AuthenticatedLayout({ children }: Props) {
  return (
    <>
      <Header />
      <Sidebar />
      <main className="ml-16 mt-[52px] min-h-[calc(100vh-52px)]">
        {children}
      </main>
    </>
  );
}
