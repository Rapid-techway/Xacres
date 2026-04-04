import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/mainLogo.png"
        alt="Xacres Logo"
        width={320}
        height={80}
        className="h-24 w-auto"
        priority
      />
    </Link>
  );
}