import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeftIcon, LetterIcon, PhoneIcon, AddIcon, MapPointIcon, BookmarkIcon } from "@solar-icons/react/linear";
import Tabs from "../../components/Tabs";
import { Button } from "../../components/Button";
import ActiveBadge from "../../components/ActiveBadge";
import EmptyState from "../../components/EmptyState";
import OrdersTable from "../../components/OrdersTable";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "../../components/Table";
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
        {tab === "Saved Locations" && (
          <Button leadingIcon={AddIcon} onClick={() => setShowAddLocation(true)}>
            Add Location
          </Button>
        )}
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "Orders" && (
        <OrdersTable orders={clientOrders} />
      )}

      {tab === "Saved Locations" && (
        <div>
          <Table aria-label="Saved locations">
            <TableHeader>
              <TableColumn isRowHeader>Location</TableColumn>
              <TableColumn>Address</TableColumn>
              <TableColumn>Tags</TableColumn>
              <TableColumn>Contact</TableColumn>
            </TableHeader>
            <TableBody renderEmptyState={() => <EmptyState icon={BookmarkIcon} title="No saved locations yet" />}>
              {clientLocations.map((loc) => (
                <TableRow key={loc.id} id={loc.id}>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <MapPointIcon size={15} className="text-blue flex-shrink-0" />
                      <span className="text-body-semibold text-navy">{loc.name}</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-muted">{loc.address}</TableCell>
                  <TableCell>
                    {loc.tags.length > 0 ? (
                      <span className="flex flex-wrap gap-1.5">
                        {loc.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-md text-caption-2-semibold text-royal bg-[#EEEAFB]" style={{ fontFamily: "var(--font-mono)" }}>{tag}</span>
                        ))}
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted">
                    {loc.contactName ? `${loc.contactName} · ${loc.contactPhone}` : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {tab === "Analytics" && <WaypointAnalyticsTable orders={clientOrders} filenamePrefix={client.name.toLowerCase().replace(/\s+/g, "-")} />}

      {showAddLocation && <AddLocationModal clientId={client.id} onClose={() => setShowAddLocation(false)} />}
    </div>
  );
}
