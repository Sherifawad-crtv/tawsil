import { lazy, Suspense } from "react";
import PageHeader from "../../components/PageHeader";

// three.js is heavy - kept out of the main bundle so every other page loads
// exactly as fast as it did before this view existed.
const OrdersGlobe = lazy(() => import("../../components/globe/OrdersGlobe"));

export default function CommandCenter() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Command Center" subtitle="The whole operation, live." />

      {/* The globe is the backdrop layer. Overlay content goes in the sibling
          layer below it, which sits on top and is centred over the sphere. */}
      <div className="relative">
        <Suspense fallback={<div style={{ height: "600px" }} />}>
          <OrdersGlobe className="w-full" style={{ height: "600px" }} />
        </Suspense>

        <div className="absolute inset-0 pointer-events-none">
          {/* Overlay content goes here. */}
        </div>
      </div>
    </div>
  );
}
