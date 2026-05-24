// Background nebula was intentionally moved out of the 3D scene.
// Large transparent BackSide sphere meshes can expose their triangle faces as
// cyan polygon artifacts near the camera. Keep this component inert until a
// shader/texture skybox replaces it with a non-obstructive background pass.
export function BackgroundNebula() {
  return null
}
