import Link from "next/link";
import { notFound } from "@/content/site";

export default function NotFound() {
  return (
    <main className="lost">
      <p className="label">{notFound.label}</p>
      <h1 className="lost__title">{notFound.title}</h1>
      <p className="lost__text">{notFound.text}</p>
      <Link className="btn" href="/">
        {notFound.back}
      </Link>
    </main>
  );
}
