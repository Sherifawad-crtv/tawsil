/**
 * A heat layer for Google Maps, drawn on a canvas that sits in the map's overlay pane.
 * (Google's own HeatmapLayer is deprecated, so this does the same job without it.)
 * Each point is a soft blob; blobs add up where points overlap; the result is coloured
 * through the gradient by how dense it is.
 */

export interface HeatPoint {
  lat: number;
  lng: number;
  /** 0 to 1 */
  intensity: number;
}

function paletteOf(gradient: Record<number, string>) {
  const c = document.createElement("canvas");
  c.width = 1;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  Object.entries(gradient)
    .sort(([a], [b]) => Number(a) - Number(b))
    .forEach(([stop, colour]) => g.addColorStop(Number(stop), colour));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1, 256);
  return ctx.getImageData(0, 0, 1, 256).data;
}

export function createHeatOverlay(
  maps: typeof google.maps,
  map: google.maps.Map,
  points: HeatPoint[],
  gradient: Record<number, string>,
  opts: { radius?: number; blur?: number; minOpacity?: number } = {},
) {
  const baseRadius = opts.radius ?? 34;
  const blur = opts.blur ?? 26;
  const minOpacity = opts.minOpacity ?? 0.3;
  const palette = paletteOf(gradient);

  class HeatOverlay extends maps.OverlayView {
    private canvas?: HTMLCanvasElement;
    private idle?: google.maps.MapsEventListener;

    onAdd() {
      const canvas = document.createElement("canvas");
      canvas.style.position = "absolute";
      canvas.style.pointerEvents = "none";
      this.canvas = canvas;
      this.getPanes()?.overlayLayer.appendChild(canvas);
      // The canvas covers the view it was drawn for; redraw once panning settles.
      this.idle = map.addListener("idle", () => this.draw());
    }

    draw() {
      const canvas = this.canvas;
      const projection = this.getProjection();
      const bounds = map.getBounds();
      const div = map.getDiv();
      if (!canvas || !projection || !bounds) return;

      const w = div.clientWidth;
      const h = div.clientHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const topLeft = projection.fromLatLngToDivPixel(new maps.LatLng(ne.lat(), sw.lng()));
      if (!topLeft) return;
      canvas.style.left = `${topLeft.x}px`;
      canvas.style.top = `${topLeft.y}px`;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      // Blobs get a little wider as the map is zoomed in.
      const zoom = map.getZoom() ?? 6;
      const radius = Math.max(20, Math.min(90, baseRadius * Math.pow(1.22, zoom - 6))) * dpr;
      const soft = blur * dpr;
      const r = radius + soft;

      const sprite = document.createElement("canvas");
      sprite.width = sprite.height = Math.ceil(r * 2);
      const sctx = sprite.getContext("2d")!;
      const grad = sctx.createRadialGradient(r, r, 0, r, r, r);
      grad.addColorStop(0, "rgba(0,0,0,1)");
      grad.addColorStop(radius / r, "rgba(0,0,0,0.55)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, sprite.width, sprite.height);

      const ctx = canvas.getContext("2d")!;
      for (const p of points) {
        const px = projection.fromLatLngToDivPixel(new maps.LatLng(p.lat, p.lng));
        if (!px) continue;
        ctx.globalAlpha = Math.max(minOpacity, Math.min(1, p.intensity)) * 0.38;
        ctx.drawImage(sprite, (px.x - topLeft.x) * dpr - r, (px.y - topLeft.y) * dpr - r);
      }

      // Colour the accumulated density through the gradient.
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = img.data;
      for (let i = 3; i < d.length; i += 4) {
        const a = d[i];
        if (!a) continue;
        const k = Math.min(255, a) * 4;
        d[i - 3] = palette[k];
        d[i - 2] = palette[k + 1];
        d[i - 1] = palette[k + 2];
        d[i] = Math.min(255, a * 1.15) * 0.85;
      }
      ctx.putImageData(img, 0, 0);
    }

    onRemove() {
      this.idle?.remove();
      this.canvas?.remove();
      this.canvas = undefined;
    }
  }

  const overlay = new HeatOverlay();
  overlay.setMap(map);
  return overlay;
}
