/** Camera distance at which an object of `height` fills `share` of a perspective view's height. */
export function distanceToFill(height: number, share: number, fovDegrees: number): number {
  const visibleHeightPerUnitDistance = 2 * Math.tan((fovDegrees * Math.PI) / 360);
  return height / (share * visibleHeightPerUnitDistance);
}
