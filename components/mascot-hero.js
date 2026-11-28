import Image from 'next/image'
import { Box } from '@chakra-ui/react'
import hero from '../public/images/construction-hero.png'

// The box keeps the image's 4:5 ratio and takes the same vertical space the
// 3D scene used to, so the content below stays where it was.
const MascotHero = () => (
  <Box
    className="mascot-hero"
    position="relative"
    m="auto"
    w={[176, 224, 256]}
    h={[220, 280, 320]}
    borderRadius="lg"
    overflow="hidden"
  >
    <Image
      src={hero}
      alt="Construction builder mascot holding a laptop"
      fill
      priority
      placeholder="blur"
      sizes="(min-width: 48em) 256px, (min-width: 30em) 224px, 176px"
      style={{ objectFit: 'cover' }}
    />
  </Box>
)

export default MascotHero
