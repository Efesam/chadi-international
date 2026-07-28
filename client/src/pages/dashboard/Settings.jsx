import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getSettings, updateSettings } from "../../services/api";
import RichTextEditor from "../../components/admin/RichTextEditor";

function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
