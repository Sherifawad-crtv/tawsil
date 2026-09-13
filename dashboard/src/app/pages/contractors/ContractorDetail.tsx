import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeftIcon, LetterIcon, PhoneIcon, AddIcon, StarIcon, UsersGroupRoundedIcon, BusIcon, BoxIcon } from "@solar-icons/react/linear";
import Tabs from "../../components/Tabs";
import { Button } from "../../components/Button";
import ActiveBadge from "../../components/ActiveBadge";
import EmptyState from "../../components/EmptyState";
import OrderRow from "../../components/OrderRow";
import DriverDetailPanel from "../../components/DriverDetailPanel";
import VehicleDetailPanel from "../../components/VehicleDetailPanel";
import AddDriverModal from "../../components/AddDriverModal";
import AddVehicleModal from "../../components/AddVehicleModal";
import WaypointAnalyticsTable from "../../components/WaypointAnalyticsTable";
import { useDataStore } from "../../lib/store";
import { getDriversForContractor, getVehiclesForContractor, getOrdersForContractor, getTruckType } from "../../lib/selectors";
import { truckTypeLabel } from "../../lib/constants";

const TABS = ["Drivers", "Vehicles", "Orders", "Analytics"];

export default function ContractorDetail() {
  const { contractorId } = useParams();
  const navigate = useNavigate();
  const { contractors, drivers, vehicles, orders, toggleContractorActive } = useDataStore();
  const [tab, setTab] = useState("Drivers");
  const [expandedDriver, setExpandedDriver] = useState<string | null>(null);
  const [expandedVehicle, setExpandedVehicle] = useState<string | null>(null);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);

  const contractor = contractors.find((c) => c.id === contractorId);
  if (!contractor) {
    return (
      <div className="text-center py-20 text-body-regular text-muted">
        Contractor not found. <Link to="/contractors" className="text-blue font-semibold">Back to Contractors</Link>
      </div>
    );
  }

  const contractorDrivers = getDriversForContractor(drivers, contractor.id);
  const contractorVehicles = getVehiclesForContractor(vehicles, contractor.id);
  const contractorOrders = getOrdersForContractor(orders, contractor.id);

  return (
    <div className="flex flex-col gap-6">
      <button onClick={() => navigate("/contractors")} className="flex items-center gap-1.5 text-body-2-regular text-muted hover:text-navy cursor-pointer w-fit">
        <ArrowLeftIcon size={15} /> Back to Contractors
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-title-1-semibold text-navy" style={{ fontFamily: "var(--font-heading)" }}>{contractor.name}</h1>
            <button onClick={() => toggleContractorActive(contractor.id)} className="cursor-pointer">
              <ActiveBadge active={contractor.active} />
            </button>
          </div>
          <div className="flex items-center gap-4 mt-1.5 text-body-2-regular text-muted flex-wrap">
            <span className="flex items-center gap-1.5"><LetterIcon size={13} /> {contractor.email}</span>
            <span className="flex items-center gap-1.5"><PhoneIcon size={13} /> {contractor.phone}</span>
          </div>
        </div>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "Drivers" && (
        <div>
          <div className="flex justify-end mb-3">
            <Button size="small" leadingIcon={AddIcon} onClick={() => setShowAddDriver(true)} className="bg-navy hover:bg-royal">
              Add Driver
            </Button>
          </div>
          {contractorDrivers.length === 0 ? (
            <EmptyState icon={UsersGroupRoundedIcon} title="No drivers yet" />
          ) : (
            <div className="flex flex-col gap-2.5">
              {contractorDrivers.map((driver) => (
                <div key={driver.id} className="rounded-2xl bg-white border border-border p-4">
                  <button
                    onClick={() => setExpandedDriver(expandedDriver === driver.id ? null : driver.id)}
                    className="w-full flex items-center justify-between gap-4 cursor-pointer text-left"
                  >
                    <div className="min-w-0">
                      <div className="text-body-semibold text-navy">{driver.name}</div>
                      <div className="text-caption-1-regular text-muted mt-0.5">{driver.email} · {driver.phone}</div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="flex items-center gap-1 text-caption-1-regular text-navy" style={{ fontFamily: "var(--font-mono)" }}>
                        <StarIcon size={12} className="text-status-pending" /> {driver.rating.toFixed(2)}
                      </span>
                      <ActiveBadge active={driver.active} />
                    </div>
                  </button>
                  {expandedDriver === driver.id && <DriverDetailPanel driver={driver} onClose={() => setExpandedDriver(null)} />}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "Vehicles" && (
        <div>
          <div className="flex justify-end mb-3">
            <Button size="small" leadingIcon={AddIcon} onClick={() => setShowAddVehicle(true)} className="bg-navy hover:bg-royal">
              Add Vehicle
            </Button>
          </div>
          {contractorVehicles.length === 0 ? (
            <EmptyState icon={BusIcon} title="No vehicles yet" />
          ) : (
            <div className="flex flex-col gap-2.5">
              {contractorVehicles.map((vehicle) => (
                <div key={vehicle.id} className="rounded-2xl bg-white border border-border p-4">
                  <button
                    onClick={() => setExpandedVehicle(expandedVehicle === vehicle.id ? null : vehicle.id)}
                    className="w-full flex items-center justify-between gap-4 cursor-pointer text-left"
                  >
                    <div className="min-w-0">
                      <div className="text-body-semibold text-navy" style={{ fontFamily: "var(--font-mono)" }}>{vehicle.plateNumber}</div>
                      <div className="text-caption-1-regular text-muted mt-0.5">{truckTypeLabel(getTruckType(vehicle.truckTypeId))}</div>
                    </div>
                    <ActiveBadge active={vehicle.active} />
                  </button>
                  {expandedVehicle === vehicle.id && <VehicleDetailPanel vehicle={vehicle} onClose={() => setExpandedVehicle(null)} />}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "Orders" && (
        <div className="rounded-2xl bg-white border border-border overflow-hidden">
          {contractorOrders.length === 0 ? (
            <EmptyState icon={BoxIcon} title="No orders yet" />
          ) : (
            contractorOrders.map((order) => <OrderRow key={order.id} order={order} />)
          )}
        </div>
      )}

      {tab === "Analytics" && <WaypointAnalyticsTable orders={contractorOrders} filenamePrefix={contractor.name.toLowerCase().replace(/\s+/g, "-")} />}

      {showAddDriver && <AddDriverModal contractorId={contractor.id} onClose={() => setShowAddDriver(false)} />}
      {showAddVehicle && <AddVehicleModal contractorId={contractor.id} onClose={() => setShowAddVehicle(false)} />}
    </div>
  );
}
