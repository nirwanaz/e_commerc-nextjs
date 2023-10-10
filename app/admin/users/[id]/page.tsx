import UpdateUser from '@/components/admin/UpdateUser';
import axios from 'axios';
import { cookies } from 'next/headers';

const getUser = async (id: string) => {
    const nextCookies = cookies();

    const nextAuthSessionToken = nextCookies.get("next-auth.session-token");

    const { data } = await axios.get(`${process.env.API_URL}/api/admin/users/${id}`,
    {
        headers: {
            Cookie: `next-auth.session-token=${nextAuthSessionToken?.value}`,
        },
    })

    return data;
}

const AdminUserDetailPage = async ({ params }: any) => {
  const data = await getUser(params?.id);
  
    return <UpdateUser user={data?.user} />
}

export default AdminUserDetailPage