import { useEffect, useState } from 'react'

interface MissionCountdownProps {
  launchDate: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function MissionCountdown({ launchDate }: MissionCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(launchDate).getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    // Calculate immediately
    calculateTimeLeft()

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [launchDate])

  return (
    <div className="flex space-x-4 text-center">
      <div>
        <div className="text-2xl font-bellefair text-white">{timeLeft.days}</div>
        <div className="text-sm font-barlow-condensed text-[#D0D6F9]">DAYS</div>
      </div>
      <div>
        <div className="text-2xl font-bellefair text-white">{timeLeft.hours}</div>
        <div className="text-sm font-barlow-condensed text-[#D0D6F9]">HOURS</div>
      </div>
      <div>
        <div className="text-2xl font-bellefair text-white">{timeLeft.minutes}</div>
        <div className="text-sm font-barlow-condensed text-[#D0D6F9]">MINUTES</div>
      </div>
      <div>
        <div className="text-2xl font-bellefair text-white">{timeLeft.seconds}</div>
        <div className="text-sm font-barlow-condensed text-[#D0D6F9]">SECONDS</div>
      </div>
    </div>
  )
}
