import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaHandsHelping } from "react-icons/fa";
import DonateModal from "../common/DonateModal";
import VolunteerModal from "../common/VolunteerModal";

function ProjectCard({ project }) {
  const [donateOpen, setDonateOpen] = useState(false);
  const [volunteerOpen, setVolunteerOpen] = useState(false);

  return (
    <div className="group overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-800">
      {/* Image */}
      <div className="relative h-60 overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />

        <span className="absolute left-5 top-5 rounded-full bg-chadi-green px-4 py-2 text-sm font-semibold text-white">
          {project.program}
        </span>
      </div>

      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-chadi-lightgreen px-3 py-1 text-sm font-semibold text-chadi-green">
            {project.status}
          </span>

          <span className="text-sm text-gray-500 dark:text-gray-400">
            {project.location}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-chadi-green dark:text-chadi-lightgreen">
          {project.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300">
          {project.summary}
        </p>

        <div className="pt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Beneficiaries
          </p>

          <p className="font-semibold dark:text-gray-100">
            {project.beneficiaries}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex font-semibold text-chadi-green hover:text-chadi-gold-dark"
          >
            Learn More →
          </Link>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setVolunteerOpen(true)}
              className="flex items-center gap-2 rounded-full border border-chadi-green px-4 py-2 text-sm font-semibold text-chadi-green transition hover:bg-chadi-green hover:text-white"
            >
              <FaHandsHelping size={12} />
              Volunteer
            </button>

            <button
              type="button"
              onClick={() => setDonateOpen(true)}
              className="flex items-center gap-2 rounded-full bg-chadi-gold px-4 py-2 text-sm font-semibold text-black transition hover:scale-105"
            >
              <FaHeart size={12} />
              Donate
            </button>
          </div>
        </div>
      </div>

      <DonateModal
        open={donateOpen}
        onClose={() => setDonateOpen(false)}
        project={{ id: project.id, title: project.title }}
      />

      <VolunteerModal
        open={volunteerOpen}
        onClose={() => setVolunteerOpen(false)}
        project={{ id: project.id, title: project.title }}
      />
    </div>
  );
}

export default ProjectCard;
