import { FaBullseye, FaEye } from "react-icons/fa";

function VisionMission() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">
          <h2 className="text-5xl font-bold text-chadi-green">
            Our Purpose
          </h2>

          <p className="mt-5 text-lg text-gray-600">
            Creating lasting impact by empowering marginalized individuals and
            underserved communities.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">

          <div className="rounded-3xl bg-chadi-green p-10 text-white shadow-xl">
            <FaEye className="mb-6 text-5xl text-chadi-gold"/>

            <h3 className="text-3xl font-bold mb-5">
              Vision
            </h3>

            <p className="text-lg leading-8">
              Empowering marginalized individuals and underserved communities
              through sustainable development, innovation, education,
              healthcare and humanitarian interventions.
            </p>
          </div>

          <div className="rounded-3xl bg-chadi-gold p-10 shadow-xl">

            <FaBullseye className="mb-6 text-5xl text-chadi-green"/>

            <h3 className="text-3xl font-bold mb-5 text-chadi-green">
              Mission
            </h3>

            <p className="text-lg leading-8 text-gray-800">
              To design and implement innovative programs that improve health,
              education, livelihoods, environmental sustainability, peace,
              technology access and community resilience across Africa.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}

export default VisionMission;
