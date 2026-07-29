function PageHeader({ title, subtitle }) {
  return (
    <section className="relative overflow-hidden bg-chadi-green py-28 text-white">

      <div className="mx-auto max-w-7xl px-6 text-center">

        <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
          {title}
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg text-chadi-lightgreen sm:text-xl">
          {subtitle}
        </p>

      </div>
    </section>
  );
}

export default PageHeader;
