import Checkpoints from '../components/Checkpoints'
import { Z01, Z02, Z03, Z04, Z05, Z06, Z07 } from '../sections/Zones'

export default function Home() {
  return (
    <>
      <Checkpoints />
      <main id="contenido" tabIndex={-1}>
        <Z01 />
        <Z02 />
        <Z03 />
        <Z04 />
        <Z05 />
        <Z06 />
        <Z07 />
      </main>
    </>
  )
}
