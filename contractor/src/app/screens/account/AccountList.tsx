import { useState } from "react";
import { useNavigate } from "react-router";
import ManageAccountsRounded from "../../components/icons/ManageAccountsRounded";
import TranslateRounded from "../../components/icons/TranslateRounded";
import HelpOutlineRounded from "../../components/icons/HelpOutlineRounded";
import LogoutRounded from "../../components/icons/LogoutRounded";
import ScreenHeader from "../../components/ScreenHeader";
import AccountRow from "../../components/AccountRow";
import ConfirmSheet from "../../components/ConfirmSheet";

export default function AccountList() {
  const navigate = useNavigate();
  const [confirmingLogout, setConfirmingLogout] = useState(false);

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
      <ScreenHeader
        title="Account"
        onBack={() => navigate("/home")}
        trailing={
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF" }}>App Version 1.9</span>
        }
      />

      <div className="w-full max-w-lg mx-auto px-4 pb-8 flex flex-col gap-2.5">
        <AccountRow
          icon={<ManageAccountsRounded sx={{ fontSize: 18, color: "#1253FA" }} />}
          label="Profile Settings"
          onClick={() => navigate("/account/profile")}
        />
        <AccountRow
          icon={<TranslateRounded sx={{ fontSize: 18, color: "#1253FA" }} />}
          label="Language"
          onClick={() => navigate("/account/language")}
        />
        {/* Help & Support has no destination yet - left as a stub, same as the current build, not wired to anything. */}
        <AccountRow icon={<HelpOutlineRounded sx={{ fontSize: 18, color: "#1253FA" }} />} label="Help & Support" onClick={() => {}} />
        <AccountRow
          icon={<LogoutRounded sx={{ fontSize: 18, color: "#DC2626" }} />}
          label="Logout"
          destructive
          onClick={() => setConfirmingLogout(true)}
        />
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
