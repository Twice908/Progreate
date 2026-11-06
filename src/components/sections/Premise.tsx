import { premise } from "@/content/site";

export default function Premise() {
  return (
    <section className="premise section-z" id="premise" data-medium="nutrient" data-premise>
      <p className="label" data-rise-in>
        {premise.label}
      </p>
      <h2 className="premise__lead" data-lines>
        {premise.lead}
      </h2>
      <p className="premise__body" data-scrub-words>
        {premise.body}
      </p>
    </section>
  );
}
