import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Mail, Phone, Plus, MapPin, Package, Bookmark } from "lucide-react";
import Tabs from "../../components/Tabs";
import ActiveBadge from "../../components/ActiveBadge";
import EmptyState from "../../components/EmptyState";
import OrderRow from "../../components/OrderRow";
import AddLocationModal from "../../components/AddLocationModal";
import WaypointAnalyticsTable from "../../components/WaypointAnalyticsTable";
import { useDataStore } from "../../lib/store";
import { getOrdersForClient } from "../../lib/selectors";

const TABS = ["Orders", "Saved Locations", "Analytics"];

export default function ClientDetail() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { clients, orders, savedLocations, toggleClientActive } = useDataStore();
  const [tab, setTab] = useState("Orders");
  const [showAddLocation, setShowAddLocation] = useState(false);

  const client = clients.find((c) => c.id === clientId);
  if (!client) {
    return (
      <div className="text-center py-20 text-sm text-muted">
        Client not found. <Link to="/clients" className="text-blue font-semibold">Back to Clients</Link>
      </div>
    );
  }

  const clientOrders = getOrdersForClient(orders, client.id);
  const clientLocations = savedLocations.filter((l) => l.clientId === client.id);

  return (
    <div className="flex flex-col gap-6">
      <button onClick={() => navigate("/clients")} className="flex items-center gap-1.5 text-sm text-muted hover:text-navy cursor-pointer w-fit">
        <ArrowLeft size={15} /> Back to Clients
      </button>

      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl md:text-3xl text-navy" style={{ fontFamily: "var(--font-heading)" }}>{client.name}</h1>
          <button onClick={() => toggleClientActive(client.id)} className="cursor-pointer">
            <ActiveBadge active={client.active} />
          </button>
        </div>
        <div className="flex items-center gap-4 mt-1.5 text-sm text-muted flex-wrap">
          <span className="flex items-center gap-1.5"><Mail size={13} /> {client.email}</span>
          <span className="flex items-center gap-1.5"><Phone size={13} /> {client.phone}</span>
        </div>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "Orders" && (
        <div className="rounded-[var(--radius-card)] bg-white border border-border overflow-hidden">
          {clientOrders.length === 0 ? (
            <EmptyState icon={Package} title="No orders yet" />
          ) : (
            clientOrders.map((order) => <OrderRow key={order.id} order={order} />)
          )}
        </div>
      )}

      {tab === "Saved Locations" && (
        <div>
          <div className="flex justify-end mb-3">
            <button onClick={() => setShowAddLocation(true)} className="flex items-center gap-2 px-3.5 py-2 rounded-[var(--radius-control)] bg-navy text-white text-xs font-semibold cursor-pointer hover:bg-royal" style={{ fontFamily: "var(--font-sub)" }}>
              <Plus size={14} /> Add Location
            </button>
          </div>
          {clientLocations.length === 0 ? (
            <EmptyState icon={Bookmark} title="No saved locations yet" />
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {clientLocations.map((loc) => (
                <div key={loc.id} className="rounded-[var(--radius-card)] bg-white border border-border p-4">
                  <div className="flex items-start gap-2">
                    <MapPin size={15} className="text-blue mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-navy">{loc.name}</div>
                      <div className="text-xs text-muted mt-0.5">{loc.address}</div>
                      {loc.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {loc.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-royal bg-[#EEEAFB]" style={{ fontFamily: "var(--font-mono)" }}>{tag}</span>
                          ))}
                        </div>
                      )}
                      {loc.contactName && <div className="text-xs text-muted mt-2">{loc.contactName} · {loc.contactPhone}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "Analytics" && <WaypointAnalyticsTable orders={clientOrders} filenamePrefix={client.name.toLowerCase().replace(/\s+/g, "-")} />}

      {showAddLocation && <AddLocationModal clientId={client.id} onClose={() => setShowAddLocation(false)} />}
    </div>
  );
}
