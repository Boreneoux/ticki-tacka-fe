import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import Skeleton from '@/components/ui/Skeleton';
import useAuthStore from '@/stores/useAuthStore';
import useProfile from '@/features/profile/hooks/useProfile';
import ProfileHeader from './components/ProfileHeader';
import ProfileDetails from './components/ProfileDetails';
import EditProfileForm from './components/EditProfileForm';
import ChangePasswordForm from './components/ChangePasswordForm';
import PointsTab from './components/PointsTab';
import CouponsTab from './components/CouponsTab';

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-48 w-full rounded-2xl" />
      <div className="flex gap-2 overflow-x-auto">
        <Skeleton className="h-9 w-28 rounded-xl" />
        <Skeleton className="h-9 w-28 rounded-xl" />
        <Skeleton className="h-9 w-36 rounded-xl" />
        <Skeleton className="h-9 w-28 rounded-xl" />
        <Skeleton className="h-9 w-32 rounded-xl" />
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}

export default function ProfilePage() {
  const { role } = useAuthStore();
  const { profile, isLoading, refetch } = useProfile();
  const isUser = role === 'User';

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <ProfileSkeleton />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            Unable to load profile. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-2xl">
      <div className="space-y-6">
        <ProfileHeader profile={profile} />

        <Tabs defaultValue="profile">
          <TabsList className="w-full md:w-auto overflow-x-auto">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="edit">Edit Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            {isUser && (
              <>
                <TabsTrigger value="points">My Points</TabsTrigger>
                <TabsTrigger value="coupons">My Coupons</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="profile">
            <ProfileDetails profile={profile} />
          </TabsContent>

          <TabsContent value="edit">
            <EditProfileForm profile={profile} onSuccess={refetch} />
          </TabsContent>

          <TabsContent value="password">
            <ChangePasswordForm />
          </TabsContent>

          {isUser && (
            <>
              <TabsContent value="points">
                <PointsTab />
              </TabsContent>

              <TabsContent value="coupons">
                <CouponsTab />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}
