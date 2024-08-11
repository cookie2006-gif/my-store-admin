import Navbar from "@/components/navbar";
import { db } from "@/lib/firebase";
import { Store } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { redirect } from "next/navigation";

interface IDashboardLayouutProps {
  children: React.ReactNode;
  params: {
    storeId: string;
  };
}

export default async function DashboardLayout({
  children,
  params,
}: IDashboardLayouutProps) {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const storeSnap = await getDocs(
    query(
      collection(db, "stores"),
      where("userId", "==", userId),
      where("id", "==", params.storeId)
    )
  );
  let store = null as any;

  storeSnap.forEach((doc) => {
    store = doc.data() as Store;
  });
  // console.log("🚀 ~ storeSnap.forEach ~ store:", store);

  if (!store) {
    redirect("/");
  }

  return (
    <div>
      <Navbar/>
      {children}
    </div>
  );
}
