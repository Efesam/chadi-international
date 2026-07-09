function Button({
  children,
  variant = "primary",
  ...props
}) {
  const styles = {
    primary:
      "bg-chadi-green text-white hover:bg-chadi-gold",
    secondary:
      "bg-chadi-lightgreen text-chadi-green hover:bg-chadi-green hover:text-white",
    outline:
      "border border-chadi-green text-chadi-green hover:bg-chadi-green hover:text-white",
  };

  return (
    <button
      {...props}
      className={`rounded-xl px-6 py-3 font-semibold transition ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

export default Button;
