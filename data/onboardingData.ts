import Onboarding1Dark from '@/assets/images/dark/onboarding1.svg'
import Onboarding1Light from '@/assets/images/light/onboarding1.svg'
import Onboarding2Dark from '@/assets/images/dark/onboarding2.svg'
import Onboarding2Light from '@/assets/images/light/onboarding2.svg'
import Onboarding3Dark from '@/assets/images/dark/onboarding3.svg'
import Onboarding3Light from '@/assets/images/light/onboarding3.svg'
import Onboarding4Dark from '@/assets/images/dark/onboarding4.svg'
import Onboarding4Light from '@/assets/images/light/onboarding4.svg'

export const onboardingData = [
  {
    lightImage: Onboarding1Light,
    darkImage: Onboarding1Dark,
    title: 'Track Your Goal',
    description: 'Don’t worry if you have trouble determining your goals. We can help you track them.',
    route: '/onboarding/2'
  },
  {
    lightImage: Onboarding2Light,
    darkImage: Onboarding2Dark,
    title: 'Get Burn',
    description: 'Let’s start a healthy lifestyle with us, together we can do it.',
    route: '/onboarding/3'
  },
  {
    lightImage: Onboarding3Light,
    darkImage: Onboarding3Dark,
    title: 'Eat Well',
    description: 'Tracking your meals and calories has never been easier.',
    route: '/onboarding/4' 
  },
  {
    lightImage: Onboarding4Light,
    darkImage: Onboarding4Dark,
    title: 'Improve Sleep  Quality',
    description: 'Improve the quality of your sleep with us, good quality sleep can bring a good mood in the morning',
    route: '/home' 
  }
]
