import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeftIcon, LetterIcon, PhoneIcon, AddIcon } from "@solar-icons/react/linear";
import Tabs from "../../components/Tabs";
import PageHeader from "../../components/PageHeader";
import { Button } from "../../components/Button";
import ActiveBadge from "../../components/ActiveBadge";
import OrdersTable from "../../components/OrdersTable";
import DriversTable from "../../components/DriversTable";
import VehiclesBoard from "../../components/fleet/VehiclesBoard";
import AddDriverModal from "../../components/AddDriverModal";
import AddVehicleModal from "../../components/AddVehicleModal";
import AnalyticsPanel from "../../components/analytics/AnalyticsPanel";
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

      <PageHeader
        title={contractor.name}
        badge={
          <button onClick={() => toggleContractorActive(contractor.id)} className="cursor-pointer">
            <ActiveBadge active={contractor.active} />
          </button>
        }
        subtitle={
          <span className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5"><LetterIcon size={13} /> {contractor.email}</span>
            <span className="flex items-center gap-1.5"><PhoneIcon size={13} /> {contractor.phone}</span>
          </span>
        }
        action={
          <>
            {tab === "Drivers" && (
              <Button leadingIcon={AddIcon} onClick={() => setShowAddDriver(true)}>
                Add Driver
              </Button>
            )}
            {tab === "Vehicles" && (
              <Button leadingIcon={AddIcon} onClick={() => setShowAddVehicle(true)}>
                Add Vehicle
              </Button>
            )}
          </>
        }
      />

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "Drivers" && <DriversTable drivers={contractorDrivers} showContractor={false} />}

      {tab === "Vehicles" && <VehiclesBoard vehicles={contractorVehicles} showContractor={false} />}

      {tab === "Orders" && (
        <OrdersTable orders={contractorOrders} />
      )}

      {tab === "Analytics" && <AnalyticsPanel orders={contractorOrders} filenamePrefix={contractor.name.toLowerCase().replace(/\s+/g, "-")} />}

      {showAddDriver && <AddDriverModal contractorId={contractor.id} onClose={() => setShowAddDriver(false)} />}
      {showAddVehicle && <AddVehicleModal contractorId={contractor.id} onClose={() => setShowAddVehicle(false)} />}
    </div>
  );
}
