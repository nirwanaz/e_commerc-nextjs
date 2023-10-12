import UpdateUser from '@/components/admin/UpdateUser';
import { getCookieName } from '@/helpers/helpers';
import axios from 'axios';
import { cookies } from 'next/headers';

const getUser = async (id: string) => {
    const nextCookies = cookies();

    const cookieName = getCookieName();

    const nextAuthSessionToken = nextCookies.get(cookieName);

    const { data } = await axios.get(`${process.env.API_URL}/api/admin/users/${id}`,
    {
        headers: {
            Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
        },
    })

    return data;
}

const AdminUserDetailPage = async ({ params }: any) => {
  const data = await getUser(params?.id);
  
    return <UpdateUser user={data?.user} />
}

export default AdminUserDetailPage