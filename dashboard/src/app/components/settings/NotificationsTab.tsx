import Toggle from "../Toggle";
import { SettingsCard, SettingsRow, SettingsSectionLabel } from "./SettingsRows";
import { useDataStore } from "../../lib/store";

/**
 * What this account gets notified about. Four toggles, one per thing this
 * app actually tracks and could plausibly notify on - order status changes,
 * the two "attention" reasons Home already surfaces (stalled pending,
 * monthly renewals), and a weekly digest. No push/SMS channel toggle: this
 * data model has no delivery channel, only a yes/no per alert type.
 */
export default function NotificationsTab() {
  const { notificationPrefs, updateNotificationPrefs } = useDataStore();

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <SettingsSectionLabel>In-app alerts</SettingsSectionLabel>
      <SettingsCard>
        <SettingsRow label="Order updates" description="Status changes on orders you can act on">
          <Toggle
            checked={notificationPrefs.orderUpdates}
            onChange={(v) => updateNotificationPrefs({ orderUpdates: v })}
            label="Order updates"
          />
        </SettingsRow>
        <SettingsRow label="Stalled order alerts" description="A Pending order sitting too long without allocation">
          <Toggle
            checked={notificationPrefs.stalledOrderAlerts}
            onChange={(v) => updateNotificationPrefs({ stalledOrderAlerts: v })}
            label="Stalled order alerts"
          />
        </SettingsRow>
        <SettingsRow label="Monthly contract renewals" description="A monthly contract approaching its last executed day">
          <Toggle
            checked={notificationPrefs.monthlyContractRenewals}
            onChange={(v) => updateNotificationPrefs({ monthlyContractRenewals: v })}
            label="Monthly contract renewals"
          />
        </SettingsRow>
      </SettingsCard>

      <SettingsSectionLabel className="mt-2">Email</SettingsSectionLabel>
      <SettingsCard>
        <SettingsRow label="Weekly summary" description="Orders, completions and revenue for the week, every Monday">
          <Toggle
            checked={notificationPrefs.weeklySummaryEmail}
            onChange={(v) => updateNotificationPrefs({ weeklySummaryEmail: v })}
            label="Weekly summary email"
          />
        </SettingsRow>
      </SettingsCard>
    </div>
  );
}
