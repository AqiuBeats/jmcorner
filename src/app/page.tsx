// import  auth from "@/lib/auth";
// import { console } from "inspector";
import { redirect } from "next/navigation";

const Page = async () => {
  // console.log('page',auth)
  // const session = await auth();
  // if (!session) redirect("/auth/login");

  return (
    <>
      <div className="bg-gray-100 rounded-lg p-4 text-center mb-6">
        <p className="text-gray-600">Signed in as:</p>
        {/* <p className="font-medium">{session.user?.email}</p> */}
      </div>
    </>
  );
};

export default Page;
