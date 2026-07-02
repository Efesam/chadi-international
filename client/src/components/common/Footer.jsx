function Footer() {
  return (
    <footer className="bg-chadi-green py-10 text-center text-white">
      <p className="text-lg font-semibold">
        © {new Date().getFullYear()} CHADI International
      </p>

      <p className="mt-2 text-sm opacity-80">
        Empowering Communities Through Innovation, Compassion and Sustainable Development.
      </p>
    </footer>
  );
}

export default Footer;