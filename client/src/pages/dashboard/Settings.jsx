import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getSettings, updateSettings } from "../../services/api";

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
