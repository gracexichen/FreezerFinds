import type { User } from '@supabase/supabase-js';
import { Card, Button, Popconfirm } from 'antd';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { showErrorToast } from '../shared/toast';

export function UserDetails({ user }: { user: User }) {
  const router = useRouter();
  async function deleteAccount() {
    try {
      console.log('Deleting account');
      const supabase = await createClient();

      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        return;
      }

      console.log('Calling API to delete this: ', data.user.id);
      const response = await fetch(`/api/users/${data.user.id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await supabase.auth.signOut();
      router.push('/auth/sign-up');
    } catch (error) {
      console.log(error);
      showErrorToast('Unable to delete account');
    }
  }

  return (
    <Card
      title={
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">User Details</div>
          <Popconfirm
            title={'Are you sure you want to delete your account?'}
            onConfirm={() => deleteAccount()}
            okText="Yes"
            cancelText="No">
            <Button size="large" danger>
              Delete Account
            </Button>
          </Popconfirm>
        </div>
      }
      className="w-1/2">
      <div className="mb-4 flex flex-col">
        <p className="text-base font-medium">
          Email: <span className="font-normal">{user.email}</span>
        </p>
        <p className="text-base font-medium">
          Joined: <span className="font-normal">{new Date(user.created_at).toLocaleDateString()}</span>
        </p>
      </div>
    </Card>
  );
}
