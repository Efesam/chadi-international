import { FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";

function TeamCard({ member }) {
  const initials = member.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  const hasSocials = member.email || member.linkedin || member.twitter;

  return (
    <div className="group overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">
      <div className="h-80 overflow-hidden">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-chadi-green text-6xl font-bold text-white">
            {initials}
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-chadi-green">
          {member.name}
        </h3>

        <p className="mt-2 font-semibold text-chadi-gold-dark">
          {member.role}
        </p>

        <p className="mt-1 text-gray-600">
          {member.department}
        </p>

        {member.bio && <p className="mt-4 text-sm leading-6 text-gray-500">{member.bio}</p>}

        {hasSocials && (
          <div className="mt-4 flex gap-3">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                aria-label={`Email ${member.name}`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-chadi-cream text-chadi-green transition hover:bg-chadi-green hover:text-white"
              >
                <FaEnvelope size={14} />
              </a>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label={`${member.name} on LinkedIn`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-chadi-cream text-chadi-green transition hover:bg-chadi-green hover:text-white"
              >
                <FaLinkedin size={14} />
              </a>
            )}
            {member.twitter && (
              <a
                href={member.twitter}
                target="_blank"
                rel="noreferrer"
                aria-label={`${member.name} on Twitter`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-chadi-cream text-chadi-green transition hover:bg-chadi-green hover:text-white"
              >
                <FaTwitter size={14} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamCard;
