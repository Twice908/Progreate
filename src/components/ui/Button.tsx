import Link from "next/link";
import type { ReactNode } from "react";
import { Arrow } from "./Icons";

type Variant = "white" | "ember" | "ghost" | "outline";

const styles: Record<Variant, string> = {
  white: "btn-white",
  ember: "btn-ember",
  ghost: "btn-ghost",
  // Quiet pill used on non-featured pricing cards
  outline:
    "btn w-full border border-white/10 bg-white/[0.03] px-8 py-3 text-white/70 hover:bg-white/[0.08] hover:text-white",
};

export default function Button({
  href,
  variant = "ember",
  arrow = true,
  className = "",
  children,
  ...rest
}: {
  href: string;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<React.ComponentProps<"a">, "href" | "className" | "children">) {
  const cls = `${styles[variant]} group ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {arrow && variant !== "ghost" && (
        <Arrow className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </>
  );

  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...rest}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {content}
    </Link>
  );
}
