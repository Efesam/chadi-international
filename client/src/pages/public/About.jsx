import PageHeader from "../../components/common/PageHeader";

function About() {
  return (
    <>
      <PageHeader
        title="About CHADI International"
        subtitle="Building resilient communities through innovation, education, humanitarian response and sustainable development."
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-12 lg:grid-cols-2">

            <div>
              <h2 className="mb-6 text-4xl font-bold text-chadi-green">
                Who We Are
              </h2>

              <p className="mb-6 leading-8 text-gray-700">
                CHADI International is a non-governmental organization
                committed to transforming lives through sustainable
                development, innovation, education, healthcare,
                environmental sustainability and humanitarian action.
              </p>

              <p className="leading-8 text-gray-700">
                We collaborate with communities, governments,
                development partners and volunteers to create lasting
                impact across Nigeria and beyond.
              </p>
            </div>

            <div className="rounded-3xl bg-chadi-green p-10 text-white">
              <h3 className="mb-5 text-3xl font-bold">
                Our Mission
              </h3>

              <p className="leading-8">
                To empower vulnerable communities through
                sustainable development initiatives that improve
                education, health, livelihoods and innovation.
              </p>

              <hr className="my-8 border-white/20" />

              <h3 className="mb-5 text-3xl font-bold">
                Our Vision
              </h3>

              <p className="leading-8">
                A world where every community has equal access to
                opportunities, dignity and sustainable growth.
              </p>
            </div>

          </div>

        </div>
      </section>
    </>
  );
}

export default About;