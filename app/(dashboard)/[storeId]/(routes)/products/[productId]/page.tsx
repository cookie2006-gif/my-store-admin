import { db } from "@/lib/firebase";
import { Category, Cuisine, Kitchen, Product, Size } from "@/types-db";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import ProductForm from "./components/product-form";

export default async function ProductPage({
  params,
}: {
  params: { storeId: string; productId: string };
}) {
  const product = (
    await getDoc(
      doc(db, "stores", params.storeId, "products", params.productId)
    )
  ).data() as Product;

  const categories = (
    await getDocs(collection(doc(db, "stores", params.storeId), "categories"))
  ).docs.map((doc) => doc.data()) as Category[];

  const kitchens = (
    await getDocs(collection(doc(db, "stores", params.storeId), "kitchens"))
  ).docs.map((doc) => doc.data()) as Kitchen[];
  const sizes = (
    await getDocs(collection(doc(db, "stores", params.storeId), "sizes"))
  ).docs.map((doc) => doc.data()) as Size[];

  const cuisines = (
    await getDocs(collection(doc(db, "stores", params.storeId), "cuisines"))
  ).docs.map((doc) => doc.data()) as Cuisine[];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={structuredClone(product)}
          categories={structuredClone(categories)}
          cuisines={structuredClone(cuisines)}
          kitchens={structuredClone(kitchens)}
          sizes={structuredClone(sizes)}
        />
      </div>
    </div>
  );
}
