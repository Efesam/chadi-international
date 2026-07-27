import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import StaggerGrid, { StaggerItem } from "../../components/common/StaggerGrid";
import Newsletter from "../../components/common/Newsletter";

const faqs = [
  {
    question: "What does CHADI do?",
    answer:
      "CHADI supports underserved communities through health, education, humanitarian relief, youth development, protection and livelihood programs.",
  },
  {
    question: "How can I volunteer?",
    answer:
      "You can apply through the volunteer page. The team will review your interest areas and follow up with next steps.",
  },
  {
    question: "Can organizations partner with CHADI?",
    answer:
      "Yes. CHADI welcomes program, funding, research and field implementation partnerships.",
  },
  {
    question: "Where does CHADI work?",
    answer:
      "CHADI focuses on Nigeria and underserved African communities, with projects designed around local needs.",
  },
];

function FAQ() {
  return (
    <>
      <Seo
        title="FAQ"
        path="/faq"
        description="Answers to common questions about CHADI International's programs, volunteering and partnerships."
      />

      <PageHeader
        title="FAQ"
        subtitle="Answers to common questions about CHADI International."
      />

      <section className="bg-white py-20">
        <StaggerGrid className="mx-auto max-w-4xl space-y-5 px-6">
          {faqs.map((item) => (
            <StaggerItem key={item.question}>
              <article className="rounded-xl bg-chadi-cream p-6">
                <h2 className="text-2xl font-bold text-chadi-green">
                  {item.question}
                </h2>
                <p className="mt-3 leading-7 text-gray-600">{item.answer}</p>
              </article>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <Newsletter />
    </>
  );
}

export default FAQ;
