import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types-db";
import { ProductColumns } from "./components/columns";
import { format } from "date-fns";
import ProductClient from "./components/client";
import { formatter } from "@/lib/utils";

export default async function ProductsPage({
  params,
}: {
  params: { storeId: string };
}) {
  const productData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "products"))
  ).docs.map((doc) => doc.data()) as Product[];

  const formattedProducts: ProductColumns[] = productData.map((item) => ({
    id: item.id,
    name: item.name,
    price: formatter.format(item.price),
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    category: item.category,
    kitchen: item.kitchen,
    cuisine: item.cuisine,
    size: item.size,
    images: item.images,
    createdAt: item.createdAt
      ? format(item.createdAt.toDate(), "MMMM do, yyyy")
      : "",
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
}
