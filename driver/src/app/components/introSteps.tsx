import type { IntroStep } from "./IntroWalkthrough";
import Inventory2Rounded from "./icons/Inventory2Rounded";
import RouteRounded from "./icons/RouteRounded";
import PhotoCameraRounded from "./icons/PhotoCameraRounded";

const blue = { fontSize: 26, color: "#1253FA" };

/** What the driver does in this app: see assigned trips, read the job, capture the proof files. */
export const INTRO_STEPS: IntroStep[] = [
  {
    icon: <Inventory2Rounded sx={blue} />,
    title: "Your trips, assigned",
    body: "Orders from your contractor wait under Pending, with the route and pickup time on each card.",
  },
  {
    icon: <RouteRounded sx={blue} />,
    title: "Know the job",
    body: "Open an order for the map, the stops, the load details and your client's phone number.",
  },
  {
    icon: <PhotoCameraRounded sx={blue} />,
    title: "Prove it",
    body: "Capture the odometer before and after, and add photos, right from the order.",
  },
];
