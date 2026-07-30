import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import { verifyDonorLink } from "../../services/api";

function DonorPortalVerify() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!token) return;

    verifyDonorLink(token)
      .then(() => navigate("/donor-portal", { replace: true }))
      .catch(() => setFailed(true));
  }, [token, navigate]);

  const status = !token || failed ? "error" : "verifying";

  return (
    <>
      <Seo title={t("donorPortalVerify.seoTitle")} path="/donor-portal/verify" description={t("donorPortalVerify.seoDescription")} />
      <PageHeader title={t("donorPortalVerify.title")} subtitle={t("donorPortalVerify.subtitle")} />

      <section className="bg-white py-20 text-center dark:bg-gray-900">
        {status === "verifying" && (
          <p className="text-gray-600 dark:text-gray-300">{t("donorPortalVerify.verifying")}</p>
        )}
        {status === "error" && (
          <div className="mx-auto max-w-md">
            <p className="font-semibold text-red-600">
              {t("donorPortalVerify.invalidLink")}
            </p>
            <Link
              to="/donor-portal"
              className="mt-4 inline-block rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white transition hover:bg-chadi-gold hover:text-black"
            >
              {t("donorPortalVerify.requestNewLink")}
            </Link>
          </div>
        )}
      </section>
    </>
  );
}

export default DonorPortalVerify;
