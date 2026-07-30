import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import Reveal from "../../components/common/Reveal";
import StaggerGrid, { StaggerItem } from "../../components/common/StaggerGrid";
import CardGridSkeleton from "../../components/common/CardGridSkeleton";
import Newsletter from "../../components/common/Newsletter";
import { useCollection } from "../../hooks/useCollection";
import { boardApi, getSettings } from "../../services/api";

function BoardCard({ member }) {
  const initials = member.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-gray-800">
      <div className="h-56 overflow-hidden">
        {member.image ? (
          <img src={member.image} alt={member.name} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-chadi-green to-[#1c3d16] text-4xl font-bold tracking-wide text-white/90">
            {initials}
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-chadi-green dark:text-chadi-lightgreen">{member.name}</h3>
        <p className="mt-1 text-sm text-chadi-gold-dark dark:text-chadi-gold">{member.role}</p>
        {member.bio && <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{member.bio}</p>}
      </div>
    </div>
  );
}

function Governance() {
  const { t, i18n } = useTranslation();
  const { data: board, loading: boardLoading } = useCollection(() => boardApi.list(i18n.language), [i18n.language]);
  const { data: settings, loading: settingsLoading } = useCollection(getSettings);
  const members = board || [];
  const policy = settings?.safeguardingPolicy;

  return (
    <>
      <Seo
        title={t("governance.seoTitle")}
        path="/governance"
        description={t("governance.seoDescription")}
      />

      <PageHeader
        title={t("governance.title")}
        subtitle={t("governance.subtitle")}
      />

      <section className="bg-white py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <h2 className="text-3xl font-bold text-chadi-green sm:text-4xl dark:text-chadi-lightgreen">{t("governance.boardTitle")}</h2>
          </Reveal>

          {boardLoading ? (
            <div className="mt-10">
              <CardGridSkeleton count={3} columns={3} />
            </div>
          ) : members.length === 0 ? (
            <p className="mt-8 text-gray-500 dark:text-gray-400">{t("governance.boardEmpty")}</p>
          ) : (
            <StaggerGrid className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <StaggerItem key={member.id}>
                  <BoardCard member={member} />
                </StaggerItem>
              ))}
            </StaggerGrid>
          )}
        </div>
      </section>

      <section className="bg-gray-50 py-20 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal>
            <h2 className="text-3xl font-bold text-chadi-green sm:text-4xl dark:text-chadi-lightgreen">{t("governance.safeguardingTitle")}</h2>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 rounded-3xl bg-white p-8 shadow-sm sm:p-10 dark:bg-gray-800">
            {settingsLoading ? (
              <p className="text-gray-500 dark:text-gray-400">{t("governance.loading")}</p>
            ) : policy ? (
              <div className="prose max-w-none text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: policy }} />
            ) : (
              <p className="leading-7 text-gray-600 dark:text-gray-300">
                {t("governance.safeguardingEmpty")}{" "}
                <Link to="/contact" className="font-semibold text-chadi-green underline dark:text-chadi-lightgreen">
                  {t("governance.safeguardingContact")}
                </Link>
                .
              </p>
            )}
          </Reveal>
        </div>
      </section>

      <Newsletter />
    </>
  );
}

export default Governance;
