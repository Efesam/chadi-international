import PageHeader from "../../components/common/PageHeader";

function Terms() {
  return (
    <>
      <PageHeader
        title="Terms of Use"
        subtitle="Guidelines for using the CHADI International website."
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl space-y-6 px-6 leading-8 text-gray-600">
          <p>
            This website shares information about CHADI programs, projects,
            events and opportunities. Content is provided for general
            information and may be updated as programs evolve.
          </p>
          <p>
            Users should not misuse the website, submit false information, or
            attempt to disrupt the platform or connected services.
          </p>
          <p>
            CHADI may update these terms as the website and services grow.
          </p>
        </div>
      </section>
    </>
  );
}

export default Terms;
