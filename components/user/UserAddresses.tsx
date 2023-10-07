import { userAddress } from "@/interfaces";
import Link from "next/link";
import { FaMapMarker } from "react-icons/fa";

interface UserAdddressesProps {
    addresses: userAddress[]
}

const UserAddresses:React.FC<UserAdddressesProps> = ({ addresses }) => {
  return addresses?.map((address) => (
    <Link href={`/address/${address._id}`} key={address._id}>
      <div className="mb-5 gap-4">
        <figure className="w-full flex align-center bg-gray-100 p-4 rounded-md cursor-pointer">
          <div className="mr-3">
            <span className="flex items-center justify-center text-yellow-500 w-12 h-12 bg-white rounded-full shadow mt-2">
              <i><FaMapMarker /></i>
            </span>
          </div>
          <figcaption className="text-gray-600">
            <p>
              {address.street} <br /> {address.city}, {address.state},{" "}
              {address.zipCode}, {address.country}
              <br />
              Phone no: {address.phoneNo}
            </p>
          </figcaption>
        </figure>
      </div>
    </Link>
  ));
};

export default UserAddresses;