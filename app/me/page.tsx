import Profile from '@/components/auth/Profile';
import { getCookieName } from '@/helpers/helpers';
import axios from 'axios';

import { cookies } from "next/headers"

const getAddresses = async () => {
  const nextCookies = cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  const { data } = await axios.get(`${process.env.API_URL}/api/address`, {
    headers:{
      Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`
    }
  });

  return data?.addresses
}

const ProfilePage = async () => {
  const addresses = await getAddresses();

  return <Profile addresses={addresses} />;
}

export default ProfilePage;