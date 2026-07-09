function SectionTitle({
  eyebrow,
  title,
  description,
  center = false,
}) {
  return (
    <div
      className={`mb-14 ${
        center ? "text-center" : ""
      }`}
    >
      {eyebrow && (
        <p className="font-semibold uppercase tracking-widest text-chadi-gold">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-3 text-4xl font-bold text-chadi-green md:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-5 max-w-3xl text-gray-600">
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionTitle;
