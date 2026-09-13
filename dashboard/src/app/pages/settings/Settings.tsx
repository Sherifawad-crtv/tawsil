import { Fragment, useState } from "react";
import { AddIcon, Pen2Icon, DangerTriangleIcon, LockKeyholeIcon, SnowflakeIcon } from "@solar-icons/react/linear";
import PageHeader from "../../components/PageHeader";
import TruckTypeFormModal from "../../components/settings/TruckTypeFormModal";
import { Button } from "../../components/Button";
import { useDataStore } from "../../lib/store";
import { useRole } from "../../lib/RoleContext";
import { CARGO_TYPES } from "../../lib/constants";
import { formatEGP } from "../../lib/format";
import type { TruckType } from "../../lib/types";

export default function Settings() {
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
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        subtitle="Truck Types & Rate Card"
        action={
          isAdmin ? (
            <Button leadingIcon={AddIcon} onClick={() => setShowAdd(true)}>
              Add Truck Type
            </Button>
          ) : undefined
        }
      />

      {!isAdmin && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-2lg bg-grey-light text-body-2-regular text-muted">
          <LockKeyholeIcon size={14} />
          Viewing only — switch to <strong className="text-navy">Admin</strong> in the top-right role switcher to edit the rate card.
        </div>
      )}

      <div className="rounded-2xl bg-white border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-body-2-regular">
            <thead>
              <tr className="bg-grey-light text-left text-caption-1-regular text-muted uppercase tracking-wide" style={{ fontFamily: "var(--font-mono)" }}>
                <th className="px-4 py-2.5 font-medium">Truck Type</th>
                <th className="px-4 py-2.5 font-medium">Config</th>
                <th className="px-4 py-2.5 font-medium">Daily Rent (EGP)</th>
                <th className="px-4 py-2.5 font-medium">Price/km (EGP)</th>
                <th className="px-4 py-2.5 font-medium">Payload (t)</th>
                {isAdmin && <th className="px-4 py-2.5 font-medium"></th>}
              </tr>
            </thead>
            <tbody>
              {Object.entries(grouped).map(([baseClass, types]) => (
                <Fragment key={baseClass}>
                  {types.map((t, i) => (
                    <tr key={t.id} className={`border-t border-border ${t.flagged ? "bg-[#FFF9EC]" : ""}`}>
                      <td className="px-4 py-2.5 text-navy font-medium">{i === 0 ? baseClass : ""}</td>
                      <td className="px-4 py-2.5 text-navy">
                        <span className="inline-flex items-center gap-1.5">
                          {t.config}
                          {t.requiresTempControl && <SnowflakeIcon size={12} className="text-blue" />}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-navy" style={{ fontFamily: "var(--font-mono)" }}>
                        <span className="inline-flex items-center gap-1.5">
                          {formatEGP(t.dailyRentEGP)}
                          {t.flagged && (
                            <span title={t.flagNote}>
                              <DangerTriangleIcon size={13} className="text-status-pending" />
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-navy" style={{ fontFamily: "var(--font-mono)" }}>{formatEGP(t.pricePerKmEGP)}</td>
                      <td className="px-4 py-2.5 text-navy" style={{ fontFamily: "var(--font-mono)" }}>{t.capacityMinT}–{t.capacityMaxT}</td>
                      {isAdmin && (
                        <td className="px-4 py-2.5">
                          <button onClick={() => setEditing(t)} className="p-1.5 rounded-lg hover:bg-grey-light cursor-pointer text-muted hover:text-navy">
                            <Pen2Icon size={14} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {types.some((t) => t.flagged) && (
                    <tr>
                      <td colSpan={isAdmin ? 6 : 5} className="px-4 pb-3 pt-0">
                        {types.filter((t) => t.flagged).map((t) => (
                          <div key={t.id} className="flex items-start gap-2 text-caption-1-regular text-status-pending bg-[#FFF9EC] rounded-lg px-3 py-2">
                            <DangerTriangleIcon size={13} className="mt-0.5 flex-shrink-0" />
                            <span>{t.flagNote}</span>
                          </div>
                        ))}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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

      {showAdd && <TruckTypeFormModal onClose={() => setShowAdd(false)} />}
      {editing && <TruckTypeFormModal existing={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
