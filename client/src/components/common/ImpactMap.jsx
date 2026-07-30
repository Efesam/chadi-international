import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { locationToCoordinates, NIGERIA_CENTER } from "../../data/nigeriaStateCoordinates";

// Leaflet's default marker icon references relative image paths that break
// once bundled by Vite - point them at the actual bundled asset URLs instead.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/** Groups projects by resolved map coordinates so multiple projects in the same state share one marker. */
function groupProjectsByLocation(projects) {
  const groups = new Map();

  for (const project of projects) {
    const coords = locationToCoordinates(project.location);
    if (!coords) continue;

    const key = coords.join(",");
    if (!groups.has(key)) {
      groups.set(key, { coords, location: project.location, projects: [] });
    }
    groups.get(key).projects.push(project);
  }

  return [...groups.values()];
}

function ImpactMap({ projects }) {
  const groups = useMemo(() => groupProjectsByLocation(projects), [projects]);

  if (groups.length === 0) return null;

  return (
    // isolate contains Leaflet's internal panes (popups use z-index 700) within
    // this element's own stacking context, so they never render above the
    // fixed site navbar (z-index 50) when a marker near the top of the map is
    // clicked.
    <div className="isolate overflow-hidden rounded-3xl shadow-lg">
      <MapContainer
        center={NIGERIA_CENTER}
        zoom={6}
        scrollWheelZoom={false}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {groups.map((group) => (
          <Marker key={group.coords.join(",")} position={group.coords}>
            <Popup maxWidth={260}>
              <div className="space-y-3">
                <p className="font-semibold text-chadi-green dark:text-chadi-lightgreen">{group.location}</p>
                {group.projects.map((project) => (
                  <div key={project.id} className="flex items-center gap-3">
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <Link
                        to={`/projects/${project.slug}`}
                        className="text-sm font-semibold text-chadi-green hover:underline dark:text-chadi-lightgreen"
                      >
                        {project.title}
                      </Link>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{project.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default ImpactMap;
