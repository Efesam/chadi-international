import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../../assets/logo.png";

/**
 * `showFullName` adds the org's registered full name under the "CHADI"
 * wordmark - used in the header and footer, where there's room for a second
 * line, but left off in tight contexts (admin sidebar, auth pages) where it
 * would just wrap awkwardly. Truncated (not wrapped) so it can never push
 * the fixed-width navbar's nav links around; `compact` tightens that cap
 * further for the navbar, where the desktop nav competes for the same row -
 * the footer's own logo column is wide enough to use the roomier default.
 */
function Logo({ light = false, showFullName = false, compact = false }) {
  const { t } = useTranslation();

  return (
    <Link to="/" className="flex items-center gap-3">
      <img
        src={logo}
        alt="CHADI International logo"
        className="h-12 w-12 rounded-full bg-white object-contain p-1 shadow-sm"
      />
      <span className="leading-tight">
        <span
          className={`block text-xl font-black ${
            light ? "text-white" : "text-chadi-green"
          }`}
        >
          CHADI
        </span>
        {showFullName && (
          <span
            className={`hidden truncate text-[11px] font-medium leading-tight sm:block ${
              compact ? "max-w-[210px]" : "max-w-[320px]"
            } ${light ? "text-white/75" : "text-gray-500 dark:text-gray-400"}`}
            title={t("common.orgFullName")}
          >
            {t("common.orgFullName")}
          </span>
        )}
      </span>
    </Link>
  );
}

export default Logo;
