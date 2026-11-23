import type { IntroStep } from "./IntroWalkthrough";
import Inventory2Rounded from "./icons/Inventory2Rounded";
import routeArt from "../../assets/intro-route.webp";
import cameraArt from "../../assets/intro-camera.webp";

const blue = { fontSize: 26, color: "#1253FA" };

/** What the driver does in this app: see assigned trips, read the job, capture the proof files. */
export const INTRO_STEPS: IntroStep[] = [
  {
    icon: <Inventory2Rounded sx={blue} />,
    title: "Your trips, assigned",
    body: "Orders from your contractor wait under Pending, with the route and pickup time on each card.",
  },
  {
    art: routeArt,
    title: "Know the job",
    body: "Open an order for the map, the stops, the load details and your client's phone number.",
  },
  {
    art: cameraArt,
    title: "Prove it",
    body: "Capture the odometer before and after, and add photos, right from the order.",
  },
];
