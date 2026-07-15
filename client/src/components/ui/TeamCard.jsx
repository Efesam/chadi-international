function TeamCard({ member }) {
  const initials = member.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">
      {member.image ? (
        <div className="h-80 bg-gray-200">
          <img
            src={member.image}
            alt={member.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex h-80 items-center justify-center bg-chadi-green text-6xl font-bold text-white">
          {initials}
        </div>
      )}

      <div className="p-6">
        <h3 className="text-2xl font-bold text-chadi-green">
          {member.name}
        </h3>

        <p className="mt-2 font-semibold text-chadi-gold">
          {member.role}
        </p>

        <p className="mt-4 text-gray-600">
          {member.department}
        </p>
      </div>
    </div>
  );
}

export default TeamCard;
