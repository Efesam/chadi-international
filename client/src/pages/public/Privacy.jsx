import PageHeader from "../../components/common/PageHeader";

function Privacy() {
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        subtitle="How CHADI handles information shared through this website."
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl space-y-6 px-6 leading-8 text-gray-600">
          <p>
            CHADI collects information submitted through contact, volunteer,
            newsletter and donation interest forms only to respond to inquiries
            and manage community engagement.
          </p>
          <p>
            We do not sell personal information. Access is limited to authorized
            team members who need the information to support CHADI activities.
          </p>
          <p>
            To update or remove information you have shared with CHADI, please
            contact the organization through the contact page.
          </p>
        </div>
      </section>
    </>
  );
}

export default Privacy;
