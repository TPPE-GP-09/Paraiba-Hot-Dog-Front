import { useCallback, useRef, useState } from 'react'
import CarrosselDogs from './CarrosselDogs'

export type HotDogCard = {
  image: string
  title: string
  alt: string
}

type CarrosselNossosDogsProps = {
  cards: readonly HotDogCard[]
}

const DRAG_THRESHOLD = 50

export default function CarrosselNossosDogs({ cards }: CarrosselNossosDogsProps) {
  const [activeIndex, setActiveIndex] = useState(1)
  const dragStartX = useRef<number | null>(null)

  const total = cards.length

  const getCardAt = useCallback(
    (offset: number) => cards[(activeIndex + offset + total) % total],
    [activeIndex, cards, total],
  )

  const goToNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % total)
  }, [total])

  const goToPrev = useCallback(() => {
    setActiveIndex((current) => (current - 1 + total) % total)
  }, [total])

  const handleDragEnd = useCallback(
    (clientX: number) => {
      if (dragStartX.current === null) return

      const diff = clientX - dragStartX.current
      dragStartX.current = null

      if (diff < -DRAG_THRESHOLD) goToNext()
      else if (diff > DRAG_THRESHOLD) goToPrev()
    },
    [goToNext, goToPrev],
  )

  const onTouchStart = (event: React.TouchEvent) => {
    dragStartX.current = event.touches[0].clientX
  }

  const onTouchEnd = (event: React.TouchEvent) => {
    handleDragEnd(event.changedTouches[0].clientX)
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = event.clientX
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    handleDragEnd(event.clientX)
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const leftCard = getCardAt(-1)
  const centerCard = getCardAt(0)
  const rightCard = getCardAt(1)

  return (
    <>
      {/* Mobile: carrossel com drag */}
      <div
        className="mt-16 flex w-full max-w-full touch-pan-y items-center justify-center gap-3 overflow-hidden min-[490px]:hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        role="region"
        aria-roledescription="carrossel"
        aria-label="Nossos hot dogs"
      >
        <CarrosselDogs {...leftCard} destacado={false} />
        <CarrosselDogs {...centerCard} destacado />
        <CarrosselDogs {...rightCard} destacado={false} />
      </div>

      {/* Tablet/Desktop: layout fixo */}
      <div className="mt-16 hidden w-full max-w-full min-w-0 flex-col items-center gap-6 min-[490px]:flex min-[490px]:flex-row min-[490px]:flex-wrap min-[490px]:items-center min-[490px]:justify-center min-[490px]:gap-3 min-[640px]:flex-nowrap min-[640px]:gap-5">
        {cards.map(({ image, title, alt }, index) => (
          <CarrosselDogs
            key={title}
            image={image}
            title={title}
            alt={alt}
            destacado={index === 1}
          />
        ))}
      </div>
    </>
  )
}
