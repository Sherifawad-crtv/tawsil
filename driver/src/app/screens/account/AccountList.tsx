import { useState } from "react";
import { useNavigate } from "react-router";
import ManageAccountsOutlined from "../../components/icons/ManageAccountsOutlined";
import TranslateRounded from "../../components/icons/TranslateRounded";
import HelpOutlineRounded from "../../components/icons/HelpOutlineRounded";
import LogoutRounded from "../../components/icons/LogoutRounded";
import PageTitle from "../../components/PageTitle";
import SectionLabel from "../../components/SectionLabel";
import AccountRow from "../../components/AccountRow";
import ConfirmSheet from "../../components/ConfirmSheet";
import { useDataStore } from "../../lib/store";

/** Account is a tab root here, so it takes the large page title instead of a back header. Rows and cards are the contractor app's. */
export default function AccountList() {
  const navigate = useNavigate();
  const { language } = useDataStore();
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const divider = <div style={{ height: "1px", backgroundColor: "#F0F0EE", margin: "0 20px" }} />;

  return (
    <div className="w-full max-w-lg mx-auto px-4" style={{ paddingTop: "max(env(safe-area-inset-top, 20px), 20px)", paddingBottom: "8px" }}>
      <PageTitle title="Account" subtitle="Your profile and settings" />

      <SectionLabel>Settings</SectionLabel>
      <div className="rounded-[22px] overflow-hidden mb-6" style={{ backgroundColor: "white" }}>
        <AccountRow
          icon={<ManageAccountsOutlined sx={{ fontSize: 19, color: "#1253FA" }} />}
          label="Profile Settings"
          description="Your details and password"
          onClick={() => navigate("/account/profile")}
        />
        {divider}
        <AccountRow
          icon={<TranslateRounded sx={{ fontSize: 19, color: "#1253FA" }} />}
          label="Language"
          description={language === "ar" ? "العربية" : "English"}
          onClick={() => navigate("/account/language")}
        />
        {divider}
        {/* Help & Support has no destination yet - left as a stub, not wired to anything. */}
        <AccountRow
          icon={<HelpOutlineRounded sx={{ fontSize: 19, color: "#1253FA" }} />}
          label="Help & Support"
          description="Questions about your account"
          onClick={() => {}}
        />
      </div>

      <div className="rounded-[22px] overflow-hidden mb-6" style={{ backgroundColor: "white" }}>
        <AccountRow
          icon={<LogoutRounded sx={{ fontSize: 19, color: "#DC2626" }} />}
          label="Log out"
          destructive
          onClick={() => setConfirmingLogout(true)}
        />
      </div>

      <p className="text-center" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#626A76" }}>
        Tawsil Driver · v1.9
      </p>

      {confirmingLogout && (
        <ConfirmSheet
          title="Log out?"
          body="You'll need to sign back in to see your assigned trips."
          confirmLabel="Log Out"
          onConfirm={() => setConfirmingLogout(false)}
          onCancel={() => setConfirmingLogout(false)}
        />
      )}
    </div>
  );
}
