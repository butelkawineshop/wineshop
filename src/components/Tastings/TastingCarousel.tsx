'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Media } from '../Media'
import type { Tasting } from '@/hooks/useTastings'
import type { Locale } from '@/constants/routes'

interface TastingCarouselProps {
  tasting: Tasting
  locale: Locale
}

export function TastingCarousel({ tasting, locale }: TastingCarouselProps) {
  const media = tasting.media || []

  // Generic content for all tastings
  const content = {
    sl: {
      overview: {
        title: 'Pregled',
        content:
          'Pri Butelki verjamemo, da je vino najboljše v dobri družbi, z napolnjenimi kozarci in brez kančka vzvišenosti. Naše degustacije so sproščeni, vodeni sprehodi skozi različne vinske teme — zasnovani tako, da se nekaj naučiš, ne da bi imel občutek, da si na predavanju.',
      },
      experience: {
        title: 'Izkušnja',
        content:
          'Poskusiš štiri cele steklenice (da, cele – ne le požirkov), dobiš konkreten narezek, da te ne odnese prehitro, in preživiš dve uri zabavne vinske izkušnje, polne zgodb, presenečenj in smeha. Včasih tudi kakšno mini tekmovanje ali celo sabraža – odvisno od izbrane teme.',
      },
      details: {
        title: 'Podrobnosti',
        content:
          'Vse degustacije so za 4 do 8 oseb in potekajo v našem prijetnem degustacijskem prostoru v Kopru. Lahko jih rezerviraš zase, podariš komu, ki potrebuje več veselja (ali vina) v življenju, ali pa si preprosto poiščeš razlog za večer v dobri družbi ob vrhunskem vinu.',
      },
      welcome: {
        title: 'Dobrodošli',
        content: 'Brez snobizma. Z veliko užitka. Dobrodošel v Butelki.',
      },
    },
    en: {
      overview: {
        title: 'Overview',
        content:
          'At Butelka, we believe wine is best enjoyed in good company, with full glasses and zero pretension. Our wine tastings are relaxed, guided adventures through different wine themes — designed to teach you something new without ever sounding like a textbook.',
      },
      experience: {
        title: 'Experience',
        content:
          "You'll taste four full bottles (yep, the real deal — not just sips), get a snack platter to keep you upright, and enjoy two hours of unapologetically fun wine talk. Expect stories, surprises, laughter, and maybe even a mini competition or sabrage moment — depending on the theme you choose.",
      },
      details: {
        title: 'Details',
        content:
          'All tastings are for 4–8 people, hosted in our cozy Koper tasting room. You can book them for yourself, gift them to someone who needs more joy (or alcohol) in their life, or just use them as an excuse to drink really good wine with really good people.',
      },
      welcome: {
        title: 'Welcome',
        content: 'Zero snobbery. Maximum enjoyment. Welcome to Butelka.',
      },
    },
  }

  const localeContent = content[locale]

  // Define slides with generic content
  const slides = [
    {
      id: 'overview',
      title: localeContent.overview.title,
      content: localeContent.overview.content,
      mediaIndex: 0,
    },
    {
      id: 'experience',
      title: localeContent.experience.title,
      content: localeContent.experience.content,
      mediaIndex: 1,
    },
    {
      id: 'details',
      title: localeContent.details.title,
      content: localeContent.details.content,
      mediaIndex: 2,
    },
    {
      id: 'welcome',
      title: localeContent.welcome.title,
      content: localeContent.welcome.content,
      mediaIndex: 3,
    },
  ]

  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      className="w-full h-[400px] md:rounded-lg overflow-hidden"
    >
      {slides.map((slide, idx) => {
        const mediaObj = media[slide.mediaIndex % media.length] || media[0]
        const imageUrl = mediaObj?.url

        return (
          <SwiperSlide key={slide.id} className="h-full">
            <div className="relative w-full h-full flex items-center justify-center">
              {imageUrl ? (
                <Media
                  src={imageUrl}
                  alt={slide.title}
                  fill
                  size="hero"
                  className="absolute inset-0 w-full h-full object-cover"
                  priority={idx === 0}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
              )}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
                  zIndex: 1,
                }}
              />
              <div className="relative z-10 text-center text-white p-8">
                <h3 className="heading-3 mb-4">{slide.title}</h3>
                <div className="text-lg font-sans">
                  {typeof slide.content === 'string' ? slide.content : slide.content}
                </div>
              </div>
            </div>
          </SwiperSlide>
        )
      })}
    </Swiper>
  )
}
