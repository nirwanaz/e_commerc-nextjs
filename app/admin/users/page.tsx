import Users from '@/components/admin/Users';
import { getCookieName } from '@/helpers/helpers';
import axios from 'axios';
import { cookies } from 'next/headers';
import queryString from 'query-string';

const getUsers = async (searchParams: any) => {
    const nextCookies = cookies();

    const cookieName = getCookieName();

    const nextAuthSessionToken = nextCookies.get(cookieName);

    const urlParams = {
        page: searchParams.page || 1,
    }

    const searchQuery = queryString.stringify(urlParams);

    const { data } = await axios.get(`${process.env.API_URL}/api/admin/users?${searchQuery}`,
    {
        headers: {
            Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
        },
    })

    return data;
}

const AdminUsersPage = async ({ searchParams }: any) => {
  const users = await getUsers(searchParams);
  
    return <Users data={users} />
}

export default AdminUsersPage