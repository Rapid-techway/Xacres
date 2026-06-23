import Navbar from "@/components/navbar/Navbar";
import { Footer1 } from "@/components/home/footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer1 />
    </>
  );
}
