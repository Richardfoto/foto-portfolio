"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export default function LocaleLink({ href, children, ...props }: Props) {
  const params = useParams();
  const locale = params?.locale || "hu";

  return (
    <Link href={`/${locale}${href}`} {...props}>
      {children}
    </Link>
  );
}
