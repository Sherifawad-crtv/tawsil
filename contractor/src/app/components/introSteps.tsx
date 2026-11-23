import type { IntroStep } from "./IntroWalkthrough";
import ReceiptLongRounded from "./icons/ReceiptLongRounded";
import LocalShippingRounded from "./icons/LocalShippingRounded";
import GroupsRounded from "./icons/GroupsRounded";

const blue = { fontSize: 26, color: "#1253FA" };

/** What the contractor does in this app: take orders, dispatch them, keep the fleet and income in view. */
export const INTRO_STEPS: IntroStep[] = [
  {
    icon: <ReceiptLongRounded sx={blue} />,
    title: "Orders come to you",
    body: "New On Demand and Monthly orders land in the Orders tab, with the route and fare on every card.",
  },
  {
    icon: <LocalShippingRounded sx={blue} />,
    title: "Dispatch in two steps",
    body: "Pick a truck, then a driver. Only the ones that are free are offered.",
  },
  {
    icon: <GroupsRounded sx={blue} />,
    title: "Run your fleet and income",
    body: "Keep your trucks and drivers up to date, and watch your revenue on Home.",
  },
];
