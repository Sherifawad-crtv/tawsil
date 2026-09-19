import { useState } from "react";
import { useNavigate } from "react-router";
import {
  MenuDotsIcon,
  EyeIcon,
  UserPlusRoundedIcon,
  Pen2Icon,
  RestartIcon,
  ForbiddenIcon,
} from "@solar-icons/react/line-duotone";
import { Dropdown, DropdownTrigger, DropdownPopover, DropdownGroup, DropdownItem, DropdownDivider } from "../Dropdown";
import AssignDriverModal from "./AssignDriverModal";
import OrderFormModal from "./OrderFormModal";
import { useDataStore } from "../../lib/store";
import { useRole } from "../../lib/RoleContext";
import { canAssignDrivers, isReadOnlyRole } from "../../lib/selectors";
import type { Order } from "../../lib/types";

/**
 * Per-row quick actions for the orders table — the same set the order page
 * offers, so common work doesn't need a round trip through the detail view.
 */
export default function OrderRowMenu({ order }: { order: Order }) {
  const navigate = useNavigate();
  const { appendStatusHistory } = useDataStore();
  const { role } = useRole();
  const [isOpen, setIsOpen] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showReorder, setShowReorder] = useState(false);

  // Executive is read-only, so it gets View order and nothing that mutates.
  const readOnly = isReadOnlyRole(role);
  const canEditCancel = !readOnly && order.status !== "Completed" && order.status !== "Cancelled";
  const canReorder = !readOnly && order.status === "Completed";
  const needsAssignment = order.status === "Pending" && canAssignDrivers(role);

  function run(action: () => void) {
    setIsOpen(false);
    action();
  }

  function handleCancel() {
    appendStatusHistory(
      order.id,
      {
        timestamp: new Date().toISOString(),
        fromStatus: order.status,
        toStatus: "Cancelled",
        note: "Cancelled from Orders list",
        actor: "Operations",
      },
      "Cancelled",
    );
  }

  return (
    <>
      <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
        <DropdownTrigger
          aria-label={`Actions for ${order.id}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white hover:text-navy"
        >
          <MenuDotsIcon size={16} />
        </DropdownTrigger>
        <DropdownPopover aria-label={`Quick actions for ${order.id}`} className="w-[220px]">
          <DropdownGroup>
            <DropdownItem onSelect={() => run(() => navigate(`/orders/${order.id}`))}>
              <EyeIcon size={16} className="text-muted" /> View order
            </DropdownItem>
            {needsAssignment && (
              <DropdownItem onSelect={() => run(() => setShowAssign(true))}>
                <UserPlusRoundedIcon size={16} className="text-muted" /> Assign driver
              </DropdownItem>
            )}
            {canEditCancel && (
              <DropdownItem onSelect={() => run(() => setShowEdit(true))}>
                <Pen2Icon size={16} className="text-muted" /> Edit order
              </DropdownItem>
            )}
            {canReorder && (
              <DropdownItem onSelect={() => run(() => setShowReorder(true))}>
                <RestartIcon size={16} className="text-muted" /> Reorder
              </DropdownItem>
            )}
          </DropdownGroup>
          {canEditCancel && (
            <>
              <DropdownDivider />
              <DropdownGroup>
                <DropdownItem
                  onSelect={() => run(handleCancel)}
                  className="text-status-cancelled hover:bg-[#FDECEC]"
                >
                  <ForbiddenIcon size={16} /> Cancel order
                </DropdownItem>
              </DropdownGroup>
            </>
          )}
        </DropdownPopover>
      </Dropdown>

      {showAssign && <AssignDriverModal order={order} onClose={() => setShowAssign(false)} />}
      {showEdit && <OrderFormModal mode="edit" initialOrder={order} onClose={() => setShowEdit(false)} />}
      {showReorder && <OrderFormModal mode="create" initialOrder={order} onClose={() => setShowReorder(false)} />}
    </>
  );
}
