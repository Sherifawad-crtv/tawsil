import { useState } from "react";
import { AddIcon, TrashBinTrashIcon } from "@solar-icons/react/bold-duotone";
import { Button } from "../Button";
import { Select } from "../Select";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "../Table";
import InviteTeamMemberModal from "./InviteTeamMemberModal";
import { useDataStore } from "../../lib/store";
import { useRole } from "../../lib/RoleContext";
import { ROLES } from "../../lib/RoleContext";
import { formatDate, initials } from "../../lib/format";
import type { Role } from "../../lib/types";

/**
 * Everyone with a seat, plus who's still pending. Only Admin can change a
 * role or remove someone - the same gate the rate card uses, so Settings
 * is consistently read-only for everyone else rather than half-editable.
 */
export default function TeamTab() {
  const { teamMembers, currentUser, updateTeamMemberRole, removeTeamMember } = useDataStore();
  const { role } = useRole();
  const isAdmin = role === "Admin";
  const [showInvite, setShowInvite] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-body-2-regular text-muted">
          {teamMembers.length + 1} people have access · {teamMembers.filter((m) => m.status === "Invited").length} pending invite
          {teamMembers.filter((m) => m.status === "Invited").length === 1 ? "" : "s"}
        </p>
        {isAdmin && (
          <Button leadingIcon={AddIcon} onClick={() => setShowInvite(true)}>
            Invite member
          </Button>
        )}
      </div>

      <Table aria-label="Team members">
        <TableHeader>
          <TableColumn isRowHeader>Name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Role</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Since</TableColumn>
          {isAdmin ? <TableColumn>{""}</TableColumn> : null}
        </TableHeader>
        <TableBody>
          <TableRow id="me">
            <TableCell>
              <span className="flex items-center gap-2.5">
                <span
                  className="w-7 h-7 rounded-full bg-navy text-white flex items-center justify-center flex-shrink-0 text-caption-2-semibold"
                  style={{ fontFamily: "var(--font-sub)" }}
                >
                  {initials(currentUser.name)}
                </span>
                <span className="font-medium">{currentUser.name}</span>
              </span>
            </TableCell>
            <TableCell className="text-muted" style={{ fontFamily: "var(--font-mono)" }}>{currentUser.email}</TableCell>
            <TableCell className="text-muted">You</TableCell>
            <TableCell>
              <span className="px-1.5 py-0.5 rounded-md text-caption-2-semibold bg-status-lime-background text-status-lime-text">Active</span>
            </TableCell>
            <TableCell className="text-muted">—</TableCell>
            {isAdmin ? <TableCell /> : null}
          </TableRow>
          {teamMembers.map((m) => (
            <TableRow key={m.id} id={m.id}>
              <TableCell>
                <span className="flex items-center gap-2.5">
                  <span
                    className="w-7 h-7 rounded-full bg-grey-light text-navy flex items-center justify-center flex-shrink-0 text-caption-2-semibold"
                    style={{ fontFamily: "var(--font-sub)" }}
                  >
                    {initials(m.name)}
                  </span>
                  <span className="font-medium">{m.name}</span>
                </span>
              </TableCell>
              <TableCell className="text-muted" style={{ fontFamily: "var(--font-mono)" }}>{m.email}</TableCell>
              <TableCell>
                {isAdmin ? (
                  <Select
                    aria-label={`Role for ${m.name}`}
                    value={m.role}
                    onChange={(v) => updateTeamMemberRole(m.id, v as Role)}
                    options={ROLES.map((r) => ({ value: r, label: r }))}
                  />
                ) : (
                  <span className="text-muted">{m.role}</span>
                )}
              </TableCell>
              <TableCell>
                <span
                  className={
                    m.status === "Active"
                      ? "px-1.5 py-0.5 rounded-md text-caption-2-semibold bg-status-lime-background text-status-lime-text"
                      : "px-1.5 py-0.5 rounded-md text-caption-2-semibold bg-status-yellow-background text-status-yellow-text"
                  }
                >
                  {m.status}
                </span>
              </TableCell>
              <TableCell className="text-muted" style={{ fontFamily: "var(--font-mono)" }}>{formatDate(m.invitedAt)}</TableCell>
              {isAdmin ? (
                <TableCell>
                  <button
                    onClick={() => removeTeamMember(m.id)}
                    className="p-1.5 rounded-lg hover:bg-[#FDECEC] cursor-pointer text-muted hover:text-status-cancelled"
                    aria-label={`Remove ${m.name}`}
                  >
                    <TrashBinTrashIcon size={14} />
                  </button>
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showInvite && <InviteTeamMemberModal onClose={() => setShowInvite(false)} />}
    </div>
  );
}
