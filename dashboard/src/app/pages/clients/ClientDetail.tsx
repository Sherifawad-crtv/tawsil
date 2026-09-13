import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeftIcon, LetterIcon, PhoneIcon, AddIcon, MapPointIcon, BoxIcon, BookmarkIcon } from "@solar-icons/react/linear";
import Tabs from "../../components/Tabs";
import { Button } from "../../components/Button";
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
      <div className="text-center py-20 text-body-regular text-muted">
        Client not found. <Link to="/clients" className="text-blue font-semibold">Back to Clients</Link>
      </div>
    );
  }

  const clientOrders = getOrdersForClient(orders, client.id);
  const clientLocations = savedLocations.filter((l) => l.clientId === client.id);

  return (
    <div className="flex flex-col gap-6">
      <button onClick={() => navigate("/clients")} className="flex items-center gap-1.5 text-body-2-regular text-muted hover:text-navy cursor-pointer w-fit">
        <ArrowLeftIcon size={15} /> Back to Clients
      </button>

      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-title-1-semibold text-navy" style={{ fontFamily: "var(--font-heading)" }}>{client.name}</h1>
          <button onClick={() => toggleClientActive(client.id)} className="cursor-pointer">
            <ActiveBadge active={client.active} />
          </button>
        </div>
        <div className="flex items-center gap-4 mt-1.5 text-body-2-regular text-muted flex-wrap">
          <span className="flex items-center gap-1.5"><LetterIcon size={13} /> {client.email}</span>
          <span className="flex items-center gap-1.5"><PhoneIcon size={13} /> {client.phone}</span>
        </div>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "Orders" && (
        <div className="rounded-2xl bg-white border border-border overflow-hidden">
          {clientOrders.length === 0 ? (
            <EmptyState icon={BoxIcon} title="No orders yet" />
          ) : (
            clientOrders.map((order) => <OrderRow key={order.id} order={order} />)
          )}
        </div>
      )}

      {tab === "Saved Locations" && (
        <div>
          <div className="flex justify-end mb-3">
            <Button size="small" leadingIcon={AddIcon} onClick={() => setShowAddLocation(true)} className="bg-navy hover:bg-royal">
              Add Location
            </Button>
          </div>
          {clientLocations.length === 0 ? (
            <EmptyState icon={BookmarkIcon} title="No saved locations yet" />
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {clientLocations.map((loc) => (
                <div key={loc.id} className="rounded-2xl bg-white border border-border p-4">
                  <div className="flex items-start gap-2">
                    <MapPointIcon size={15} className="text-blue mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-body-semibold text-navy">{loc.name}</div>
                      <div className="text-caption-1-regular text-muted mt-0.5">{loc.address}</div>
                      {loc.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {loc.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded-md text-caption-2-semibold text-royal bg-[#EEEAFB]" style={{ fontFamily: "var(--font-mono)" }}>{tag}</span>
                          ))}
                        </div>
                      )}
                      {loc.contactName && <div className="text-caption-1-regular text-muted mt-2">{loc.contactName} · {loc.contactPhone}</div>}
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
