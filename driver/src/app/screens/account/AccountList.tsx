import { useState } from "react";
import { useNavigate } from "react-router";
import ManageAccountsOutlined from "@mui/icons-material/ManageAccountsOutlined";
import TranslateRounded from "@mui/icons-material/TranslateRounded";
import HelpOutlineRounded from "@mui/icons-material/HelpOutlineRounded";
import LogoutRounded from "@mui/icons-material/LogoutRounded";
import AccountRow from "../../components/AccountRow";
import ConfirmSheet from "../../components/ConfirmSheet";

/**
 * Account is a tab root here (unlike Contractor, where it lived behind a
 * gear icon) - Driver's bottom nav has only 3 tabs and Account is one of
 * them, so this renders like Home/Orders: a plain large title, no back
 * chevron. The flagged "tab-bar pill bleeding into this row" bug has
 * nothing to reproduce it here - the tab bar is rendered exactly once, in
 * BottomTabBar, and nowhere else in this page's content.
 */
export default function AccountList() {
  const navigate = useNavigate();
  const [confirmingLogout, setConfirmingLogout] = useState(false);

  return (
    <div className="w-full max-w-lg mx-auto px-4" style={{ paddingTop: "max(env(safe-area-inset-top, 12px), 12px)", paddingBottom: "8px" }}>
      <div className="flex items-start justify-between gap-3 mb-5">
        <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "26px", color: "#040033" }}>Account</h1>
        <span className="mt-2" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF" }}>App Version 1.9</span>
      </div>

      <div className="flex flex-col gap-2.5">
        <AccountRow icon={<ManageAccountsOutlined sx={{ fontSize: 18, color: "#1253FA" }} />} label="Profile Settings" onClick={() => navigate("/account/profile")} />
        <AccountRow icon={<TranslateRounded sx={{ fontSize: 18, color: "#1253FA" }} />} label="Language" onClick={() => navigate("/account/language")} />
        {/* Help & Support has no destination yet - left as a stub, not wired to anything. */}
        <AccountRow icon={<HelpOutlineRounded sx={{ fontSize: 18, color: "#1253FA" }} />} label="Help & Support" onClick={() => {}} />
        <AccountRow icon={<LogoutRounded sx={{ fontSize: 18, color: "#DC2626" }} />} label="Logout" destructive onClick={() => setConfirmingLogout(true)} />
      </div>

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
