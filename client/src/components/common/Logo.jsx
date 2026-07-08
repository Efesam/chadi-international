import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

function Logo({ light = false }) {
  return (
    <Link to="/" className="flex items-center gap-3">
      <img
        src={logo}
        alt="CHADI International logo"
        className="h-12 w-12 rounded-full bg-white object-contain p-1 shadow-sm"
      />
      <span
        className={`text-xl font-black leading-tight ${
          light ? "text-white" : "text-chadi-green"
        }`}
      >
        CHADI
      </span>
      
    </Link>
  );
}

export default Logo;
