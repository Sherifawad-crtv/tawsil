import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { DangerTriangleIcon } from "@solar-icons/react/bold-duotone";

/**
 * Catches a render error in the routed page and shows it in place, leaving
 * the shell, the sidebar and the role switch usable. Without this, one page
 * throwing unmounted the whole tree and every route after it was blank -
 * the audit found exactly that when Executive opened /orders. Class
 * component because React only exposes error boundaries that way.
 */
class Boundary extends Component<{ children: ReactNode; resetKey: string }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Route render failed:", error, info.componentStack);
  }

  componentDidUpdate(prev: { resetKey: string }) {
    // A navigation is a fresh start: clear the error when the route changes.
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="rounded-2xl bg-white border border-border p-8 flex flex-col items-center text-center gap-2">
        <span className="w-10 h-10 rounded-2xl bg-[#FDECEC] text-status-cancelled flex items-center justify-center">
          <DangerTriangleIcon size={18} />
        </span>
        <p className="text-body-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>This page hit an error</p>
        <p className="text-body-2-regular text-muted max-w-md" style={{ fontFamily: "var(--font-mono)" }}>
          {this.state.error.message}
        </p>
        <Link to="/" className="mt-2 text-caption-1-semibold text-blue hover:underline" style={{ fontFamily: "var(--font-sub)" }}>
          Back to Home
        </Link>
      </div>
    );
  }
}

export default function RouteErrorBoundary({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return <Boundary resetKey={pathname}>{children}</Boundary>;
}
