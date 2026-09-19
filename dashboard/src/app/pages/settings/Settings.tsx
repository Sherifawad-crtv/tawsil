import { useState } from "react";
import { AddIcon, Pen2Icon, DangerTriangleIcon, LockKeyholeIcon, SnowflakeIcon } from "@solar-icons/react/line-duotone";
import PageHeader from "../../components/PageHeader";
import Tabs from "../../components/Tabs";
import TruckTypeFormModal from "../../components/settings/TruckTypeFormModal";
import AccountTab from "../../components/settings/AccountTab";
import TeamTab from "../../components/settings/TeamTab";
import NotificationsTab from "../../components/settings/NotificationsTab";
import { Button } from "../../components/Button";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "../../components/Table";
import { useDataStore } from "../../lib/store";
import { useRole } from "../../lib/RoleContext";
import { CARGO_TYPES } from "../../lib/constants";
import { formatEGP } from "../../lib/format";
import type { TruckType } from "../../lib/types";

const TABS = ["Account", "Team", "Notifications", "Rate Card", "Cargo Types"];

export default function Settings() {
  const [tab, setTab] = useState("Account");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" subtitle="Account, team access and the rate card." />

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "Account" && <AccountTab />}
      {tab === "Team" && <TeamTab />}
      {tab === "Notifications" && <NotificationsTab />}
      {tab === "Rate Card" && <RateCardTab />}
      {tab === "Cargo Types" && <CargoTypesTab />}
    </div>
  );
}

/** Unchanged from before the tabs existed - moved in as its own section, not rebuilt. */
function RateCardTab() {
  const { truckTypes } = useDataStore();
  const { role } = useRole();
  const isAdmin = role === "Admin";
  const [editing, setEditing] = useState<TruckType | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const grouped = truckTypes.reduce<Record<string, TruckType[]>>((acc, t) => {
    (acc[t.baseClass] ??= []).push(t);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-body-2-regular text-muted">{truckTypes.length} truck type configurations</p>
        {isAdmin && (
          <Button leadingIcon={AddIcon} onClick={() => setShowAdd(true)}>
            Add Truck Type
          </Button>
        )}
      </div>

      {!isAdmin && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-2lg bg-grey-light text-body-2-regular text-muted">
          <LockKeyholeIcon size={14} />
          Viewing only — switch to <strong className="text-navy">Admin</strong> in the top-right role switcher to edit the rate card.
        </div>
      )}

      <Table aria-label="Truck types and rate card">
        <TableHeader>
          <TableColumn isRowHeader>Truck Type</TableColumn>
          <TableColumn>Config</TableColumn>
          <TableColumn>Daily Rent (EGP)</TableColumn>
          <TableColumn>Price/km (EGP)</TableColumn>
          <TableColumn>Payload (t)</TableColumn>
          {isAdmin ? <TableColumn>{""}</TableColumn> : null}
        </TableHeader>
        <TableBody>
          {Object.entries(grouped).flatMap(([baseClass, types]) => {
            const rows = types.map((t, i) => (
              <TableRow key={t.id} id={t.id} className={t.flagged ? "bg-[#FFF9EC]" : undefined}>
                <TableCell><span className="font-medium">{i === 0 ? baseClass : ""}</span></TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1.5">
                    {t.config}
                    {t.requiresTempControl && <SnowflakeIcon size={12} className="text-blue" />}
                  </span>
                </TableCell>
                <TableCell style={{ fontFamily: "var(--font-mono)" }}>
                  <span className="inline-flex items-center gap-1.5">
                    {formatEGP(t.dailyRentEGP)}
                    {t.flagged && (
                      <span title={t.flagNote}>
                        <DangerTriangleIcon size={13} className="text-status-pending" />
                      </span>
                    )}
                  </span>
                </TableCell>
                <TableCell style={{ fontFamily: "var(--font-mono)" }}>{formatEGP(t.pricePerKmEGP)}</TableCell>
                <TableCell style={{ fontFamily: "var(--font-mono)" }}>{t.capacityMinT}–{t.capacityMaxT}</TableCell>
                {isAdmin ? (
                  <TableCell>
                    <button onClick={() => setEditing(t)} className="p-1.5 rounded-lg hover:bg-grey-light cursor-pointer text-muted hover:text-navy">
                      <Pen2Icon size={14} />
                    </button>
                  </TableCell>
                ) : null}
              </TableRow>
            ));
            const flagged = types.filter((t) => t.flagged);
            if (flagged.length > 0) {
              rows.push(
                <TableRow key={`${baseClass}-flags`} id={`${baseClass}-flags`}>
                  <TableCell colSpan={isAdmin ? 6 : 5} className="pt-0 pb-3">
                    {flagged.map((t) => (
                      <div key={t.id} className="flex items-start gap-2 text-caption-1-regular text-status-pending bg-[#FFF9EC] rounded-lg px-3 py-2">
                        <DangerTriangleIcon size={13} className="mt-0.5 flex-shrink-0" />
                        <span>{t.flagNote}</span>
                      </div>
                    ))}
                  </TableCell>
                </TableRow>,
              );
            }
            return rows;
          })}
        </TableBody>
      </Table>

      {showAdd && <TruckTypeFormModal onClose={() => setShowAdd(false)} />}
      {editing && <TruckTypeFormModal existing={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

/** Unchanged from before the tabs existed. */
function CargoTypesTab() {
  return (
    <div className="rounded-2xl bg-white border border-border p-4">
      <h3 className="text-body-semibold text-navy mb-3" style={{ fontFamily: "var(--font-sub)" }}>Cargo Type Taxonomy</h3>
      <p className="text-caption-1-regular text-muted mb-3">
        {CARGO_TYPES.length} cargo types. This list drives the Cargo Type field in Order creation, filtered per truck type's allowed types.
      </p>
      <div className="flex flex-wrap gap-1.5">
        {CARGO_TYPES.map((type) => (
          <span key={type} className="px-2.5 py-1 rounded-full text-caption-1-regular text-navy bg-grey-light" style={{ fontFamily: "var(--font-sub)" }}>
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}
