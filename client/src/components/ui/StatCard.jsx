function StatCard({ stat }) {
  const Icon = stat.icon;

  return (
    <div className="rounded-3xl bg-white p-8 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-chadi-green text-white">
        <Icon size={28} />
      </div>

      <h3 className="text-4xl font-bold text-chadi-green">
        {stat.number}
        {stat.suffix}
      </h3>

      <p className="mt-2 text-gray-600">{stat.label}</p>
    </div>
  );
}

export default StatCard;