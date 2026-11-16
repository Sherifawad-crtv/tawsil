import { useState } from "react";
import { useNavigate } from "react-router";
import ManageAccountsRounded from "../../components/icons/ManageAccountsRounded";
import TranslateRounded from "../../components/icons/TranslateRounded";
import HelpOutlineRounded from "../../components/icons/HelpOutlineRounded";
import LogoutRounded from "../../components/icons/LogoutRounded";
import ScreenHeader from "../../components/ScreenHeader";
import SectionLabel from "../../components/SectionLabel";
import AccountRow from "../../components/AccountRow";
import ConfirmSheet from "../../components/ConfirmSheet";
import { useDataStore } from "../../lib/store";

export default function AccountList() {
  const navigate = useNavigate();
  const { language } = useDataStore();
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const divider = <div style={{ height: "1px", backgroundColor: "#F0F0EE", margin: "0 20px" }} />;

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
      <ScreenHeader title="Account" onBack={() => navigate("/home")} />

      <div className="w-full max-w-lg mx-auto px-4 pt-5 pb-8">
        <SectionLabel>Settings</SectionLabel>
        <div className="rounded-[22px] overflow-hidden mb-6" style={{ backgroundColor: "white" }}>
          <AccountRow
            icon={<ManageAccountsRounded sx={{ fontSize: 19, color: "#1253FA" }} />}
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
          Tawsil Contractor · v1.9
        </p>
      </div>

      {confirmingLogout && (
        <ConfirmSheet
          title="Log out?"
          body="You'll need to sign back in to manage your fleet and orders."
          confirmLabel="Log Out"
          onConfirm={() => setConfirmingLogout(false)}
          onCancel={() => setConfirmingLogout(false)}
        />
      )}
    </div>
  );
}
