export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.11} />
      <hemisphereLight args={['#9cc9ff', '#0b1020', 0.08]} />
    </>
  )
}
