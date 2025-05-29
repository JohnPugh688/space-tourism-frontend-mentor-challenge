interface AchievementBadgeProps {
  name: string
  description: string
  imageUrl: string
  progress: number
  isEarned: boolean
}

export default function AchievementBadge({ name, description, imageUrl, progress, isEarned }: AchievementBadgeProps) {
  return (
    <div className={`p-4 rounded ${isEarned ? 'bg-white/20' : 'bg-white/10'}`}>
      <div className="flex items-center gap-4">
        {/* Badge Icon */}
        <div className="relative">
          <div
            className={`w-12 h-12 rounded-full bg-center bg-cover ${!isEarned && 'grayscale opacity-50'}`}
            style={{
              backgroundImage: `url(${imageUrl})`,
            }}
          />
          {isEarned && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0B0D17]" />
          )}
        </div>

        {/* Badge Info */}
        <div className="flex-1">
          <h3 className="text-white font-barlow-condensed text-lg">{name}</h3>
          <p className="text-[#D0D6F9] text-sm">{description}</p>
        </div>
      </div>

      {/* Progress Bar (only show if not earned) */}
      {!isEarned && (
        <div className="mt-3">
          <div className="h-1 bg-white/10 rounded overflow-hidden">
            <div className="h-full bg-white/30 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-right mt-1">
            <span className="text-[#D0D6F9] text-xs">{progress}%</span>
          </div>
        </div>
      )}
    </div>
  )
}
