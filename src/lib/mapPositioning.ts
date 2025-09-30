/**
 * Map positioning utilities for precise marker centering
 */

export type ScreenMode = 'mobile' | 'tablet' | 'desktop';

/**
 * Wait for map projection to be ready
 */
export const waitProjection = async (
  map: google.maps.Map,
  tries = 12
): Promise<google.maps.Projection | null> => {
  return new Promise((resolve) => {
    const tick = () => {
      const proj = map.getProjection?.();
      if (proj || tries <= 0) {
        resolve(proj || null);
        return;
      }
      setTimeout(() => {
        waitProjection(map, tries - 1).then(resolve);
      }, 50);
    };
    tick();
  });
};

/**
 * Get UI safe areas based on screen size
 */
export const getUiSafeArea = () => {
  const width = window.innerWidth;
  const markerAnchorPx = 65; // Icon anchor Y coordinate
  
  let drawerHeightPx = 0;
  if (width < 768) {
    // Mobile
    drawerHeightPx = Math.round(window.innerHeight * 0.40);
  } else if (width < 1024) {
    // Tablet
    drawerHeightPx = Math.round(window.innerHeight * 0.32);
  }
  
  const infoWindowTopPadPx = 110;
  
  return { drawerHeightPx, infoWindowTopPadPx, markerAnchorPx };
};

/**
 * Get target zoom level based on screen size
 */
export const getTargetZoom = (): number => {
  const width = window.innerWidth;
  if (width < 768) return 10; // Mobile
  if (width < 1024) return 11; // Tablet
  return 12; // Desktop
};

/**
 * Get current screen mode
 */
export const getScreenMode = (): ScreenMode => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

/**
 * Center map with pixel-perfect offset using projection
 */
export const centerWithOffset = async (
  map: google.maps.Map,
  latLng: google.maps.LatLng,
  offsetX: number,
  offsetY: number
): Promise<void> => {
  const proj = await waitProjection(map);
  
  if (!proj) {
    // Fallback if projection not ready
    map.panTo(latLng);
    requestAnimationFrame(() => {
      setTimeout(() => map.panBy(offsetX, offsetY), 50);
    });
    return;
  }
  
  const zoom = map.getZoom() ?? 10;
  const scale = Math.pow(2, zoom);
  const worldPoint = proj.fromLatLngToPoint(latLng);
  
  if (!worldPoint) {
    map.setCenter(latLng);
    return;
  }
  
  const pixelOffset = new google.maps.Point(offsetX / scale, offsetY / scale);
  const targetPoint = new google.maps.Point(
    worldPoint.x - pixelOffset.x,
    worldPoint.y - pixelOffset.y
  );
  const targetLatLng = proj.fromPointToLatLng(targetPoint);
  
  if (targetLatLng) {
    map.setCenter(targetLatLng);
  }
};

/**
 * Center marker at exact screen point accounting for UI overlays and marker anchor
 */
export const centerMarker = async (
  map: google.maps.Map,
  latLng: google.maps.LatLng,
  mode: ScreenMode
): Promise<void> => {
  const { drawerHeightPx, infoWindowTopPadPx, markerAnchorPx } = getUiSafeArea();
  const minZoom = getTargetZoom();
  
  // Only zoom in if needed
  const currentZoom = map.getZoom() ?? 0;
  if (currentZoom < minZoom) {
    map.setZoom(minZoom);
  }
  
  // Calculate offset to center marker in visible area
  let offsetY: number;
  if (mode === 'mobile' || mode === 'tablet') {
    // Center marker in visible area above drawer, accounting for marker anchor
    offsetY = (drawerHeightPx / 2) - (markerAnchorPx / 2);
  } else {
    // Desktop: offset for InfoWindow
    offsetY = -infoWindowTopPadPx;
  }
  
  const offsetX = 0;
  
  await centerWithOffset(map, latLng, offsetX, offsetY);
};
