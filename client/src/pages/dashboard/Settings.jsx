import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import toast from "react-hot-toast";
import { getSettings, updateSettings } from "../../services/api";
import RichTextEditor from "../../components/admin/RichTextEditor";

// Shown as placeholders only (illustrative) - the real defaults used when a
// step is left blank live server-side, in server/src/lib/emailSequence.js's
// DEFAULT_TEMPLATES.
const SEQUENCE_STEPS_UI = [
  {
    key: "welcome",
    label: "Welcome",
    day: "Day 0",
    hint: "Sent right away to every new newsletter subscriber or first-time donor. Use {name} for their name.",
    subjectPlaceholder: "Welcome to the CHADI family",
    bodyPlaceholder: `Dear {name},

Welcome to CHADI International - thank you for joining us.

Whether you found us through a friend, a donation, or simply because you believe children and communities deserve a fighting chance, we're glad you're here.

Over the next few weeks, we'll share a few stories from the field, show you exactly where support like yours goes, and let you know how you can be part of what's next. No spam, no noise - just the real work, as it happens.

Thank you for standing with us.`,
  },
  {
    key: "story",
    label: "Story",
    day: "Day 3",
    hint: "A story from the field. Use {name} for their name.",
    subjectPlaceholder: "A story we think you'll want to hear",
    bodyPlaceholder: `Dear {name},

We want to tell you about someone whose story stayed with us.

At one of our sickle cell support sessions, a teenage boy sat quietly at the back for weeks, never speaking. Living with sickle cell disease had taught him to expect pain first and people second. Then one afternoon, surrounded by others who understood exactly what he carried, he finally spoke - about the fear, the hospital nights, the friends who stopped calling.

By the end of that session, he wasn't the quiet one anymore. He was the one reassuring a newer member that it gets easier.

This is the work: not just treatment, but belonging - community that says, out loud, "you are not alone in this."

Stories like his are why we do what we do, and why we're glad you're part of this community.`,
  },
  {
    key: "impact",
    label: "Impact",
    day: "Day 7",
    hint: "Use {name}, {projects}, {beneficiaries}, {communities}, {volunteers} and {percentage} - all fill in automatically from Homepage Stats and Fund Allocation above.",
    subjectPlaceholder: "Here's what your community is doing together",
    bodyPlaceholder: `Dear {name},

Numbers rarely capture what matters most, but they do tell part of the story.

Right now, CHADI International runs {projects} projects, reaching an estimated {beneficiaries} people across {communities} communities - alongside {volunteers} volunteers who show up again and again.

{percentage}% of every donation goes directly into programs and field work: school supplies, health support, mental health and sickle cell care, and livelihood training for women and families working to stand on their own feet.

You're part of every one of those numbers now. Thank you for that.`,
  },
  {
    key: "donationAsk",
    label: "Donation Ask",
    day: "Day 14",
    hint: "A direct, warm invitation to give. Use {name} and {donateUrl} (fills in automatically).",
    subjectPlaceholder: "Will you help write the next story?",
    bodyPlaceholder: `Dear {name},

By now you've heard a little about who we are and the people we walk alongside. We'd love for you to help us do more of it.

A monthly gift, even a modest one, is what lets us plan ahead - keeping a health worker in the field, a classroom stocked, and a support group meeting every week rather than whenever funds allow.

If you've been thinking about it, this is your invitation: {donateUrl}

Whatever you're able to give, thank you for considering it.`,
  },
  {
    key: "updates",
    label: "Updates",
    day: "Day 21",
    hint: "Closes out the series and points them to ongoing content. Use {name} and {blogUrl} (fills in automatically).",
    subjectPlaceholder: "Stay close to the work",
    bodyPlaceholder: `Dear {name},

This is the last email in this short welcome series - but certainly not the last you'll hear from us.

We regularly publish new stories, project updates, and field reports on our blog: {blogUrl}. It's where we share the moments that don't fit neatly into an email, and the ongoing progress of the work your support makes possible.

From here, expect the occasional update rather than a set schedule - always real, always from the field.

Thank you for walking with us this far. We're glad you're here.`,
  },
];

// Shown as the textarea's placeholder only (illustrative) - the real default
// used when this field is left blank lives server-side, in
// server/src/lib/receiptImpact.js's DEFAULT_DONATION_LETTER.
const DEFAULT_DONATION_LETTER_PLACEHOLDER = `Dear {name},

Somewhere right now, a child who has never been told they matter is getting a second chance. And you are part of why.

Your donation is going straight to children who have lost parents, children living with special needs, young people who woke up this morning with no one in their corner. We sit with them, we teach them, we remind them they are not forgotten.

Last time we gathered, a young girl stood up in front of everyone and performed for the first time in her life. She had never done anything like that before. When the room cheered for her, she covered her face and cried. Not from sadness. From shock - because nobody had ever clapped for her before.

Your gift made that moment possible.

{percentage}% of every donation goes straight to the children. The rest keeps us running so we can reach more of them.

This is bigger than any one gift. We are building something that will outlast all of us - a world where no child grows up invisible. And you are now part of that.

Thank you for showing up for them.`;

function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openSteps, setOpenSteps] = useState(() => new Set(["welcome"]));

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch(() => toast.error("Could not load settings"))
      .finally(() => setLoading(false));
  }, []);

  const updateStat = (index, key, value) => {
    setSettings((prev) => {
      const stats = [...prev.stats];
      stats[index] = { ...stats[index], [key]: key === "value" ? Number(value) : value };
      return { ...prev, stats };
    });
  };

  const updateAllocation = (index, key, value) => {
    setSettings((prev) => {
      const fundAllocation = [...(prev.fundAllocation || [])];
      fundAllocation[index] = {
        ...fundAllocation[index],
        [key]: key === "percentage" ? Number(value) : value,
      };
      return { ...prev, fundAllocation };
    });
  };

  const updateField = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateSocial = (key, value) => {
    setSettings((prev) => ({ ...prev, socials: { ...prev.socials, [key]: value } }));
  };

  const updateSequenceEmail = (stepKey, field, value) => {
    setSettings((prev) => ({
      ...prev,
      emailSequence: {
        ...prev.emailSequence,
        [stepKey]: { ...(prev.emailSequence?.[stepKey] || {}), [field]: value },
      },
    }));
  };

  const toggleStep = (key) => {
    setOpenSteps((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const updated = await updateSettings(settings);
      setSettings(updated);
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err.message || "Could not save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <p className="text-gray-500">Loading settings...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-chadi-green">Site Settings</h1>
      <p className="mt-1 text-sm text-gray-500">
        These values feed the homepage stats and contact details across the public site.
      </p>

      <form onSubmit={handleSave} className="mt-8 space-y-8">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-bold text-chadi-green">Homepage Stats</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {settings.stats.map((stat, index) => (
              <div key={index} className="rounded-xl border border-gray-100 p-4">
                <label className="block text-xs font-semibold uppercase text-gray-400">
                  Label
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(event) => updateStat(index, "label", event.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-chadi-green"
                  />
                </label>
                <label className="mt-3 block text-xs font-semibold uppercase text-gray-400">
                  Value
                  <input
                    type="number"
                    value={stat.value}
                    onChange={(event) => updateStat(index, "value", event.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-chadi-green"
                  />
                </label>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-bold text-chadi-green">Fund Allocation</h2>
          <p className="mt-1 text-sm text-gray-500">
            Shown as a chart on the public Transparency page. Percentages should add up to 100.
          </p>

          <div className="mt-4 space-y-3">
            {(settings.fundAllocation || []).map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={item.category}
                  onChange={(event) => updateAllocation(index, "category", event.target.value)}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-chadi-green"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={item.percentage}
                  onChange={(event) => updateAllocation(index, "percentage", event.target.value)}
                  className="w-20 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-chadi-green"
                />
                <span className="text-sm text-gray-400">%</span>
              </div>
            ))}
          </div>

          {(settings.fundAllocation || []).length > 0 && (
            <p
              className={`mt-3 text-xs font-semibold ${
                (settings.fundAllocation || []).reduce((sum, i) => sum + Number(i.percentage || 0), 0) === 100
                  ? "text-gray-400"
                  : "text-red-500"
              }`}
            >
              Total:{" "}
              {(settings.fundAllocation || []).reduce((sum, i) => sum + Number(i.percentage || 0), 0)}%
              {(settings.fundAllocation || []).reduce((sum, i) => sum + Number(i.percentage || 0), 0) !== 100 &&
                " (should add up to 100)"}
            </p>
          )}
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-bold text-chadi-green">Contact Information</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Contact Email</span>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(event) => updateField("contactEmail", event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Office Hours</span>
              <input
                type="text"
                value={settings.officeHours}
                onChange={(event) => updateField("officeHours", event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold text-gray-700">Focus Region</span>
              <input
                type="text"
                value={settings.focusRegion}
                onChange={(event) => updateField("focusRegion", event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold text-gray-700">Organization Registration / Tax ID</span>
              <input
                type="text"
                value={settings.orgRegistration || ""}
                onChange={(event) => updateField("orgRegistration", event.target.value)}
                placeholder="e.g. CAC/IT/NO 12345 - shown on donation receipts once set"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
              />
              <span className="mt-1 block text-xs text-gray-400">
                Left blank, donation receipts simply omit this line.
              </span>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold text-gray-700">Registered Address</span>
              <input
                type="text"
                value={settings.orgAddress || ""}
                onChange={(event) => updateField("orgAddress", event.target.value)}
                placeholder="Shown on donation receipts once set"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Phone Number</span>
              <input
                type="text"
                value={settings.orgPhone || ""}
                onChange={(event) => updateField("orgPhone", event.target.value)}
                placeholder="Shown on donation receipts once set"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Receipt Signatory</span>
              <input
                type="text"
                value={settings.receiptSignatory || ""}
                onChange={(event) => updateField("receiptSignatory", event.target.value)}
                placeholder="e.g. Jane Doe, Executive Director"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
              />
              <span className="mt-1 block text-xs text-gray-400">
                Adds a signature line to donation receipts once set.
              </span>
            </label>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-bold text-chadi-green">Donation Letter</h2>
          <p className="mt-1 text-sm text-gray-500">
            The personal thank-you message on a general (not project-specific) donation
            receipt and email. Separate paragraphs with a blank line. Use{" "}
            <code className="rounded bg-gray-100 px-1">{"{name}"}</code> for the donor's name
            and <code className="rounded bg-gray-100 px-1">{"{percentage}"}</code> for the
            Programs &amp; Field Work percentage above - both fill in automatically. Left
            blank, the default letter shown below is used.
          </p>
          <div className="mt-4">
            <textarea
              rows={14}
              value={settings.donationLetter || ""}
              onChange={(event) => updateField("donationLetter", event.target.value)}
              placeholder={DEFAULT_DONATION_LETTER_PLACEHOLDER}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-chadi-green"
            />
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-bold text-chadi-green">Welcome Email Series</h2>
          <p className="mt-1 text-sm text-gray-500">
            5 automated emails sent over 3 weeks to every new newsletter subscriber and every
            first-time donor (whichever happens first - each person only ever gets one series).
            Left blank, each step uses the default wording shown as its placeholder below.
          </p>

          <div className="mt-4 space-y-3">
            {SEQUENCE_STEPS_UI.map((step) => {
              const isOpen = openSteps.has(step.key);
              return (
                <div key={step.key} className="overflow-hidden rounded-xl border border-gray-100">
                  <button
                    type="button"
                    onClick={() => toggleStep(step.key)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-gray-50"
                  >
                    <span className="flex items-center gap-3">
                      <span className="rounded-full bg-chadi-green/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-chadi-green">
                        {step.day}
                      </span>
                      <span className="font-semibold text-gray-800">{step.label}</span>
                    </span>
                    <FaChevronDown
                      className={`shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="space-y-3 border-t border-gray-100 bg-gray-50/50 px-4 py-4">
                      <p className="text-xs text-gray-400">{step.hint}</p>
                      <label className="block">
                        <span className="text-xs font-semibold uppercase text-gray-400">Subject</span>
                        <input
                          type="text"
                          value={settings.emailSequence?.[step.key]?.subject || ""}
                          onChange={(event) => updateSequenceEmail(step.key, "subject", event.target.value)}
                          placeholder={step.subjectPlaceholder}
                          className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-chadi-green"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold uppercase text-gray-400">Body</span>
                        <textarea
                          rows={10}
                          value={settings.emailSequence?.[step.key]?.body || ""}
                          onChange={(event) => updateSequenceEmail(step.key, "body", event.target.value)}
                          placeholder={step.bodyPlaceholder}
                          className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-chadi-green"
                        />
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-bold text-chadi-green">Safeguarding Policy</h2>
          <p className="mt-1 text-sm text-gray-500">
            Shown on the public Governance page. Left blank, that page shows a
            "being finalized - contact us" message instead of a blank section.
          </p>
          <div className="mt-4">
            <RichTextEditor
              value={settings.safeguardingPolicy || ""}
              onChange={(html) => updateField("safeguardingPolicy", html)}
            />
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-bold text-chadi-green">Social Links</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {Object.keys(settings.socials).map((key) => (
              <label key={key} className="block">
                <span className="text-sm font-semibold capitalize text-gray-700">{key}</span>
                <input
                  type="url"
                  value={settings.socials[key]}
                  onChange={(event) => updateSocial(key, event.target.value)}
                  placeholder={`https://${key}.com/chadiinternational`}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
                />
              </label>
            ))}
          </div>
        </section>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-chadi-green px-8 py-3 font-semibold text-white transition hover:bg-chadi-gold hover:text-black disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}

export default Settings;
