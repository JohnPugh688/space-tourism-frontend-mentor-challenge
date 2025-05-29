import { redirect, type LoaderFunctionArgs } from 'react-router'
import { useLoaderData } from 'react-router'
import OptimizedBackground from '~/components/shared/OptimizedBackground'
import MissionCountdown from '~/components/mission-control/MissionCountdown'
import AchievementBadge from '~/components/mission-control/AchievementBadge'
import { createServerSupabase } from '~/utils/supabase'

interface Mission {
  id: string
  name: string
  launch_date: string
  status: string
  basic_descrip: string
  thumbnail_url: string | null
}

interface Badge {
  name: string
  description: string
  image_url: string
}

interface Achievement {
  id: string
  progress: number
  earned_date: string | null
  badges: Badge
}

type LoaderData = {
  missions: Mission[]
  achievements: Achievement[]
}

// Loader to fetch mission control data
export async function loader({ request }: LoaderFunctionArgs) {
  console.log('Mission Control Loader - Starting')

  // Get server-side supabase client
  const supabase = createServerSupabase(request)

  // Get session from Supabase
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  console.log('Mission Control - Session Check:', {
    hasSession: !!session,
    sessionError: sessionError?.message,
    userId: session?.user?.id,
    accessToken: session?.access_token ? '[EXISTS]' : '[MISSING]',
  })

  // Get the cookies from the Supabase client
  const cookieStore = (supabase as any).cookies as string[]
  const headers = new Headers()

  // Add each cookie to the response headers
  if (cookieStore?.length) {
    console.log('Mission Control - Setting cookies:', cookieStore.length)
    const cookieHeader = cookieStore.join(', ')
    headers.set('Set-Cookie', cookieHeader)
  }

  // If no session, redirect to home
  if (!session) {
    console.log('Mission Control - No session, redirecting')
    return redirect('/?error=unauthorized', {
      headers,
    })
  }

  try {
    console.log('Mission Control - Fetching user profile for:', session.user.id)

    // First, get or create user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', session.user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching user profile:', profileError)
      throw new Error('Error fetching user profile')
    }

    let profileId = userProfile?.id

    if (!profileId) {
      console.log('Mission Control - Creating new user profile')
      const { data: newProfile, error: createProfileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: session.user.id,
            display_name: session.user.email?.split('@')[0] || 'Space Explorer',
          },
        ])
        .select('id')
        .single()

      if (createProfileError) {
        console.error('Error creating user profile:', createProfileError)
        throw new Error('Error creating user profile')
      }
      profileId = newProfile.id
    }

    // Fetch active missions
    const { data: missions, error: missionsError } = await supabase
      .from('missions')
      .select(
        `
        id,
        name,
        launch_date,
        status,
        basic_descrip,
        thumbnail_url
      `,
      )
      .in('status', ['IN_PROGRESS', 'UPCOMING'])
      .order('launch_date', { ascending: true })

    if (missionsError) {
      console.error('Error loading missions:', missionsError)
      throw new Error('Error loading missions')
    }

    // Fetch user achievements with badge details
    const { data: achievements, error: achievementsError } = await supabase
      .from('user_achievements')
      .select(
        `
        id,
        progress,
        earned_date,
        badges!inner (
          name,
          description,
          image_url
        )
      `,
      )
      .eq('user_id', profileId)

    if (achievementsError) {
      console.error('Error loading achievements:', achievementsError)
      throw new Error('Error loading achievements')
    }

    // Transform achievements to match our type
    const transformedAchievements = achievements?.map((achievement: any) => ({
      id: achievement.id,
      progress: achievement.progress,
      earned_date: achievement.earned_date,
      badges: achievement.badges[0],
    }))

    return {
      missions: missions || [],
      achievements: transformedAchievements || [],
    }
  } catch (error) {
    console.error('Mission Control - Error:', error)
    throw new Response(error instanceof Error ? error.message : 'An error occurred', { status: 500 })
  }
}

export default function MissionControl() {
  const { missions, achievements } = useLoaderData<typeof loader>()

  return (
    <main className="min-h-screen relative">
      {/* Background */}
      <OptimizedBackground
        mobileImage={{
          webp: '/mission-control/8247194011_9461bbec30_4k.webp',
          fallback: '/mission-control/8247194011_9461bbec30_4k.webp',
        }}
        tabletImage={{
          webp: '/mission-control/8247194011_9461bbec30_4k.webp',
          fallback: '/mission-control/8247194011_9461bbec30_4k.webp',
        }}
        desktopImage={{
          webp: '/mission-control/8247194011_9461bbec30_4k.webp',
          fallback: '/mission-control/8247194011_9461bbec30_4k.webp',
        }}
        className="bg-cover bg-center bg-fixed bg-no-repeat min-h-screen opacity-50 mix-blend-normal before:content-[''] before:absolute before:inset-0 before:bg-black/40"
      />

      <div className="container mx-auto px-6 md:px-10 lg:px-40 pt-24 md:pt-36 lg:pt-48">
        {/* Page Title */}
        <header className="text-center lg:text-left mb-8 md:mb-14">
          <h1 className="font-barlow-condensed text-white">
            <span className="text-amber-400 font-bold mr-4">04</span>
            MISSION CONTROL
          </h1>
        </header>

        {/* Mission Control Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Mission Status Panel */}
          <section className="lg:col-span-8 bg-black/40 backdrop-blur-md p-6 rounded-lg border border-amber-500/20">
            <h2 className="text-2xl text-amber-400 font-barlow-condensed tracking-[2.7px] uppercase mb-6">
              Active Missions
            </h2>
            {missions.length > 0 ? (
              <div className="space-y-4">
                {missions.map((mission) => (
                  <div
                    key={mission.id}
                    className="bg-black/50 p-4 rounded border border-amber-500/10 hover:border-amber-500/30 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-amber-400 font-barlow-condensed tracking-[2.36px] text-xl uppercase">
                          {mission.name}
                        </h3>
                        <p className="text-slate-300 text-sm font-barlow-condensed">{mission.basic_descrip}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-amber-400/80 text-sm font-barlow-condensed tracking-[2.36px]">
                          LAUNCH IN
                        </div>
                        <MissionCountdown launchDate={mission.launch_date} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-300 text-center font-barlow-condensed">No active missions at this time.</p>
            )}
          </section>

          {/* Achievement System */}
          <section className="lg:col-span-4 bg-black/40 backdrop-blur-md p-6 rounded-lg border border-amber-500/20">
            <h2 className="text-2xl text-amber-400 font-barlow-condensed tracking-[2.7px] uppercase mb-6">
              Achievements
            </h2>
            {achievements.length > 0 ? (
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    name={achievement.badges.name}
                    description={achievement.badges.description}
                    imageUrl={achievement.badges.image_url}
                    progress={achievement.progress}
                    isEarned={achievement.earned_date !== null}
                  />
                ))}
              </div>
            ) : (
              <p className="text-slate-300 text-center font-barlow-condensed">Start exploring to earn achievements!</p>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

// Error boundary component
export function ErrorBoundary() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl text-white mb-4">Access Denied</h1>
        <p className="text-[#D0D6F9]">Please log in to access Mission Control.</p>
      </div>
    </div>
  )
}
