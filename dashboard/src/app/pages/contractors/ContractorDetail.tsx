import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeftIcon, LetterIcon, PhoneIcon, AddIcon } from "@solar-icons/react/linear";
import Tabs from "../../components/Tabs";
import { Button } from "../../components/Button";
import ActiveBadge from "../../components/ActiveBadge";
import OrdersTable from "../../components/OrdersTable";
import DriversTable from "../../components/DriversTable";
import VehiclesTable from "../../components/VehiclesTable";
import AddDriverModal from "../../components/AddDriverModal";
import AddVehicleModal from "../../components/AddVehicleModal";
import WaypointAnalyticsTable from "../../components/WaypointAnalyticsTable";
import { useDataStore } from "../../lib/store";
import { getDriversForContractor, getVehiclesForContractor, getOrdersForContractor } from "../../lib/selectors";

const TABS = ["Drivers", "Vehicles", "Orders", "Analytics"];

export default function ContractorDetail() {
  const { contractorId } = useParams();
  const navigate = useNavigate();
  const { contractors, drivers, vehicles, orders, toggleContractorActive } = useDataStore();
  const [tab, setTab] = useState("Drivers");
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
          <DriversTable drivers={contractorDrivers} showContractor={false} />
        </div>
      )}

      {tab === "Vehicles" && (
        <div>
          <div className="flex justify-end mb-3">
            <Button size="small" leadingIcon={AddIcon} onClick={() => setShowAddVehicle(true)} className="bg-navy hover:bg-royal">
              Add Vehicle
            </Button>
          </div>
          <VehiclesTable vehicles={contractorVehicles} showContractor={false} />
        </div>
      )}

      {tab === "Orders" && (
        <OrdersTable orders={contractorOrders} />
      )}

      {tab === "Analytics" && <WaypointAnalyticsTable orders={contractorOrders} filenamePrefix={contractor.name.toLowerCase().replace(/\s+/g, "-")} />}

      {showAddDriver && <AddDriverModal contractorId={contractor.id} onClose={() => setShowAddDriver(false)} />}
      {showAddVehicle && <AddVehicleModal contractorId={contractor.id} onClose={() => setShowAddVehicle(false)} />}
    </div>
  );
}
