function PageHeader({ title, subtitle }) {
  return (
    <section className="relative overflow-hidden bg-chadi-green py-28 text-white">

      <div className="mx-auto max-w-7xl px-6 text-center">

        <h1 className="text-5xl font-bold md:text-6xl">
          {title}
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-xl text-chadi-lightgreen">
          {subtitle}
        </p>

      </div>
    </section>
  );
}

export default PageHeader;
