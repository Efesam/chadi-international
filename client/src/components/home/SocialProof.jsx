import { useTranslation } from "react-i18next";
import { FaFacebookF, FaXTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa6";
import Reveal from "../common/Reveal";
import { useCollection } from "../../hooks/useCollection";
import { getSettings } from "../../services/api";

const YOUTUBE_CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID;
// A channel's "uploads" playlist id is always its channel id with the
// leading UC swapped for UU - a documented trick that embeds a channel's
// latest videos without needing a paid API key or OAuth app review, unlike
// Instagram/LinkedIn's official embed APIs.
const UPLOADS_PLAYLIST_ID = YOUTUBE_CHANNEL_ID?.replace(/^UC/, "UU");

const socialIcons = {
  facebook: FaFacebookF,
  twitter: FaXTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
};

/**
 * Real social proof, not static images: an embedded feed of the org's
 * actual latest YouTube uploads (config-gated on VITE_YOUTUBE_CHANNEL_ID -
 * renders nothing until set), plus links to the other channels already
 * configured in Settings. Instagram/LinkedIn don't have an equivalent
 * no-credentials embed option (their live-feed APIs require OAuth app
 * review or a paid third-party widget service), so those stay as simple
 * "follow us" links rather than a live feed this code can't actually build
 * without real credentials.
 */
function SocialProof() {
  const { t } = useTranslation();
  const { data: settings } = useCollection(getSettings);
  const socials = settings?.socials || {};
  const activeSocials = Object.entries(socials).filter(([, url]) => url);

  if (!UPLOADS_PLAYLIST_ID && activeSocials.length === 0) return null;

  return (
    <section className="bg-white py-24 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <Reveal>
          <p className="font-semibold uppercase tracking-widest text-chadi-gold-dark">{t("home.socialProof.eyebrow")}</p>
          <h2 className="mt-3 text-4xl font-bold text-chadi-green sm:text-5xl">{t("home.socialProof.title")}</h2>
        </Reveal>

        {UPLOADS_PLAYLIST_ID && (
          <Reveal delay={0.1} className="mt-10 overflow-hidden rounded-3xl shadow-lg">
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/videoseries?list=${UPLOADS_PLAYLIST_ID}`}
                title="CHADI International - Latest Videos"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Reveal>
        )}

        {activeSocials.length > 0 && (
          <Reveal delay={0.2} className="mt-10 flex justify-center gap-4">
            {activeSocials.map(([platform, url]) => {
              const Icon = socialIcons[platform] || FaYoutube;
              return (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`CHADI International on ${platform}`}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-chadi-cream text-chadi-green transition hover:bg-chadi-green hover:text-white"
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </Reveal>
        )}
      </div>
    </section>
  );
}

export default SocialProof;
