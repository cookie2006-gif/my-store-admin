import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Origin } from "@/types-db";
import { OriginColumns } from "./components/columns";
import { format } from "date-fns";
import OriginClient from "./components/client";

export default async function OriginsPage({
  params,
}: {
  params: { storeId: string };
}) {
  const OriginsData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "origins"))
  ).docs.map((doc) => doc.data()) as Origin[];

  const formattedOrigins: OriginColumns[] = OriginsData.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: item.createdAt
      ? format(item.createdAt.toDate(), "MMMM do, yyyy")
      : "",
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OriginClient data={formattedOrigins} />
      </div>
    </div>
  );
}
