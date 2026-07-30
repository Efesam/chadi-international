function StatCard({ stat }) {
  const Icon = stat.icon;

  return (
    <div className="group rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-chadi-lightgreen hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
      {/* Icon */}
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-chadi-green text-white transition-all duration-300 group-hover:bg-chadi-gold group-hover:text-chadi-green">
        <Icon size={30} />
      </div>

      {/* Number */}
      <h3 className="text-4xl font-bold text-chadi-green md:text-5xl dark:text-chadi-lightgreen">
        {stat.number}
        <span className="text-chadi-gold-dark dark:text-chadi-gold">{stat.suffix}</span>
      </h3>

      {/* Label */}
      <p className="mt-3 text-base font-medium text-gray-600 dark:text-gray-300">
        {stat.label}
      </p>

      {/* Optional Description */}
      {stat.description && (
        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
          {stat.description}
        </p>
      )}
    </div>
  );
}

export default StatCard;
