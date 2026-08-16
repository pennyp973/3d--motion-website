import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

// Cinematic grade: bloom for the emissive golds, a breath of chromatic
// aberration at the frame edges, and an in-render vignette.
export default function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.32}
        luminanceThreshold={1.05}
        luminanceSmoothing={0.25}
        mipmapBlur
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.0003, 0.00022]}
        radialModulation
        modulationOffset={0.6}
      />
      <Vignette eskil={false} offset={0.14} darkness={0.62} />
    </EffectComposer>
  )
}
