import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-baseline font-bold tracking-tight text-foreground group">
      <span className="text-3xl">X</span>
      <span className="text-xl">acres</span>
    </Link>
  );
}
