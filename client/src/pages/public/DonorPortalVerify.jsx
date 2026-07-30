import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import { verifyDonorLink } from "../../services/api";

function DonorPortalVerify() {
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
      <Seo title="Signing In" path="/donor-portal/verify" description="Signing you in to the CHADI donor portal." />
      <PageHeader title="Donor Portal" subtitle="Signing you in..." />

      <section className="bg-white py-20 text-center dark:bg-gray-900">
        {status === "verifying" && (
          <p className="text-gray-600 dark:text-gray-300">Verifying your sign-in link...</p>
        )}
        {status === "error" && (
          <div className="mx-auto max-w-md">
            <p className="font-semibold text-red-600">
              This sign-in link is invalid or has expired.
            </p>
            <Link
              to="/donor-portal"
              className="mt-4 inline-block rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white transition hover:bg-chadi-gold hover:text-black"
            >
              Request a New Link
            </Link>
          </div>
        )}
      </section>
    </>
  );
}

export default DonorPortalVerify;
