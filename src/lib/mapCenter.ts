/**
 * Screen-point-based map centering utilities
 * Positions markers at exact screen pixels, independent of zoom/anchor
 */

/**
 * Wait for map projection to be ready
 */
async function waitProjection(
  map: google.maps.Map,
  tries = 12,
  delay = 50
): Promise<google.maps.Projection | null> {
  return new Promise((resolve) => {
    const tick = (left: number) => {
      const p = map.getProjection?.();
      if (p || left <= 0) return resolve(p || null);
      setTimeout(() => tick(left - 1), delay);
    };
    tick(tries);
  });
}

/**
 * Center map so that a marker's anchor lands at exact screen coordinates
 */
export async function centerMarkerAtScreenPoint(
  map: google.maps.Map,
  markerLatLng: google.maps.LatLng,
  targetClientX: number,
  targetClientY: number,
  anchorYpx = 65
): Promise<void> {
  // 1) Ensure projection is ready
  const proj = await waitProjection(map);
  if (!proj) {
    // Fallback: panTo + small panBy
    map.panTo(markerLatLng);
    requestAnimationFrame(() => setTimeout(() => map.panBy(0, 0), 30));
    return;
  }

  const zoom = map.getZoom() ?? 10;
  const scale = Math.pow(2, zoom);

  // 2) Compute world points
  const markerWorld = proj.fromLatLngToPoint(markerLatLng);
  if (!markerWorld) {
    map.setCenter(markerLatLng);
    return;
  }

  // 3) Compute current marker screen position
  const container = map.getDiv();
  const rect = container.getBoundingClientRect();
  const currentCenter = map.getCenter();
  if (!currentCenter) {
    map.setCenter(markerLatLng);
    return;
  }
  const centerWorld = proj.fromLatLngToPoint(currentCenter);
  if (!centerWorld) {
    map.setCenter(markerLatLng);
    return;
  }

  // Helper to map world -> screen px at current zoom
  const worldToScreen = (worldPt: google.maps.Point) => {
    return {
      x: (worldPt.x - centerWorld.x) * scale + rect.width / 2,
      y: (worldPt.y - centerWorld.y) * scale + rect.height / 2,
    };
  };

  const markerScreen = worldToScreen(markerWorld);

  // 4) We want the marker's anchor tip to land at targetClientX, targetClientY
  const desired = {
    x: targetClientX - rect.left,
    y: targetClientY - rect.top + anchorYpx / 2,
  };

  // 5) Compute delta in screen px, convert back to world delta
  const dxScreen = markerScreen.x - desired.x;
  const dyScreen = markerScreen.y - desired.y;

  const dxWorld = dxScreen / scale;
  const dyWorld = dyScreen / scale;

  const newCenterWorld = new google.maps.Point(
    centerWorld.x + dxWorld,
    centerWorld.y + dyWorld
  );
  const newCenterLatLng = proj.fromPointToLatLng(newCenterWorld);

  if (newCenterLatLng) {
    map.setCenter(newCenterLatLng);
  }
}

/**
 * Get target screen point for marker centering based on device size
 */
export function getTargetScreenPoint(
  rect: DOMRect
): { targetX: number; targetY: number } {
  const width = window.innerWidth;
  const targetX = rect.left + rect.width / 2;

  let targetY: number;
  if (width < 768) {
    // Mobile: 35% from top
    targetY = rect.top + rect.height * 0.35;
  } else if (width < 1024) {
    // Tablet: 38% from top
    targetY = rect.top + rect.height * 0.38;
  } else {
    // Desktop: 25% from top (leaves room for InfoWindow)
    targetY = rect.top + rect.height * 0.25;
  }

  return { targetX, targetY };
}

/**
 * Get target zoom level based on screen size
 */
export function getTargetZoom(): number {
  const width = window.innerWidth;
  if (width < 768) return 10; // Mobile
  if (width < 1024) return 11; // Tablet
  return 12; // Desktop
}
