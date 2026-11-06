import { brief } from "@/content/site";
import BriefForm from "@/components/BriefForm";

export default function Brief() {
  return (
    <section className="brief section-z" id="brief" data-medium="tcbs" aria-labelledby="brief-title">
      <p className="label" data-rise-in>
        {brief.label}
      </p>
      <h2 className="brief__title" id="brief-title" data-lines>
        {brief.title}
      </h2>
      <p className="brief__sub" data-rise-in>
        {brief.sub}
      </p>
      <BriefForm />
    </section>
  );
}
