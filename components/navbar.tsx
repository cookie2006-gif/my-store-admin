import { UserButton } from "@clerk/nextjs";
import MainNav from "./main-nav";
import StoreSwitcher from "./store-switcher";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Store } from "@/types-db";
import { db } from "@/lib/firebase";

export default async function Navbar() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const storeSnap = await getDocs(
    query(collection(db, "stores"), where("userId", "==", userId))
  );

  let stores = [] as Store[];

  storeSnap.forEach((doc) => stores.push(doc.data() as Store));

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={structuredClone(stores)} />
        {/* routes */}
        <MainNav />
        {/* user profile */}
        <div className="ml-auto">
          <UserButton />
        </div>
      </div>
    </div>
  );
}
