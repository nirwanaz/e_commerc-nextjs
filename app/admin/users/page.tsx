import Users from '@/components/admin/Users';
import axios from 'axios';
import { cookies } from 'next/headers';
import queryString from 'query-string';

const getUsers = async (searchParams: any) => {
    const nextCookies = cookies();

    const nextAuthSessionToken = nextCookies.get("next-auth.session-token");

    const urlParams = {
        page: searchParams.page || 1,
    }

    const searchQuery = queryString.stringify(urlParams);

    const { data } = await axios.get(`${process.env.API_URL}/api/admin/users?${searchQuery}`,
    {
        headers: {
            Cookie: `next-auth.session-token=${nextAuthSessionToken?.value}`,
        },
    })

    return data;
}

const AdminUsersPage = async ({ searchParams }: any) => {
  const users = await getUsers(searchParams);
  
    return <Users data={users} />
}

export default AdminUsersPage