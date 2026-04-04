import Navbar from "@/components/navbar/Navbar";
import { Footer1 } from "@/components/home/footer1";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {children}
      </main>
      <Footer1/>
    </>
  );
}
