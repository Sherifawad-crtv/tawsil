import type { IntroStep } from "./IntroWalkthrough";
import ordersArt from "../../assets/intro-orders.webp";
import truckArt from "../../assets/intro-truck.webp";
import peopleArt from "../../assets/intro-people.webp";

/** What the contractor does in this app: take orders, dispatch them, keep the fleet and income in view. */
export const INTRO_STEPS: IntroStep[] = [
  {
    art: ordersArt,
    title: "Orders come to you",
    body: "New On Demand and Monthly orders land in the Orders tab, with the route and fare on every card.",
  },
  {
    art: truckArt,
    title: "Dispatch in two steps",
    body: "Pick a truck, then a driver. Only the ones that are free are offered.",
  },
  {
    art: peopleArt,
    title: "Run your fleet and income",
    body: "Keep your trucks and drivers up to date, and watch your revenue on Home.",
  },
];
