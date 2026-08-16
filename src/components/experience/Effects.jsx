import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

// Cinematic grade: bloom for the emissive golds, a breath of chromatic
// aberration at the frame edges, and an in-render vignette.
export default function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.55}
        luminanceThreshold={0.9}
        luminanceSmoothing={0.3}
        mipmapBlur
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.00045, 0.00035]}
        radialModulation
        modulationOffset={0.6}
      />
      <Vignette eskil={false} offset={0.18} darkness={0.78} />
    </EffectComposer>
  )
}
