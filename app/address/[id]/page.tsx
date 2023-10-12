import UpdateAddress from "@/components/user/updateAddress";
import { getCookieName } from "@/helpers/helpers";
import axios from "axios";
import { cookies } from "next/headers";


const getAddress = async (id: string) => {
    const nextCookies = cookies();

    const cookieName = getCookieName();

    const nextAuthSessionToken = nextCookies.get(cookieName);

    const { data } = await axios.get(`${process.env.API_URL}/api/address/${id}`, {
        headers: {
            Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`
        }
    })

    return data?.address;
}

const UpdateAddressPage = async ({ params }: { params: { id: string } }) => {
    const address = await getAddress(params?.id);

    return <UpdateAddress id={params?.id} address={address} />
}

export default UpdateAddressPage;