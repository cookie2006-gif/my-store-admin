import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  serverTimestamp,
  addDoc,
  collection,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { Store } from "@/types-db";
import { deleteObject, ref } from "firebase/storage";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 400 });
    }
    const { name } = body;
    if (!params.storeId) {
      return new NextResponse("Store Name is Required!", { status: 400 });
    }

    const docRef = doc(db, "stores", params.storeId);
    await updateDoc(docRef, { name });
    const store = (await getDoc(docRef)).data() as Store;
    return NextResponse.json(store);
  } catch (error) {
    console.log(`STORES_POST:${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("Store Name is Required!", { status: 400 });
    }

    const docRef = doc(db, "stores", params.storeId);
    // TODO: Delete all the subcollections along with those data files

    // billboards and its images
    const billboardsQuerySnapShot = await getDocs(
      collection(db, `stores/${params.storeId}/billboards`)
    );
    billboardsQuerySnapShot.forEach(async (billboardDoc) => {
      await deleteDoc(billboardDoc.ref);
      //  remove images from the storages
      const iamgeUrl = billboardDoc.data().imageUrl;
      if (iamgeUrl) {
        const imageRef = ref(storage, iamgeUrl);
        await deleteObject(imageRef);
      }
    });

    // categories
    const categoriesQuerySnapShot = await getDocs(
      collection(db, `stores/${params.storeId}/categories`)
    );
    categoriesQuerySnapShot.forEach(async (categoryDoc) => {
      await deleteDoc(categoryDoc.ref);
    });

    // sizes
    const sizesQuerySnapShot = await getDocs(
      collection(db, `stores/${params.storeId}/sizes`)
    );
    sizesQuerySnapShot.forEach(async (sizeDoc) => {
      await deleteDoc(sizeDoc.ref);
    });

    // kitchens
    const kitchensQuerySnapShot = await getDocs(
      collection(db, `stores/${params.storeId}/kitchens`)
    );
    kitchensQuerySnapShot.forEach(async (kitchenDoc) => {
      await deleteDoc(kitchenDoc.ref);
    });
    // cuisines
    const cuisinesQuerySnapShot = await getDocs(
      collection(db, `stores/${params.storeId}/cuisines`)
    );
    cuisinesQuerySnapShot.forEach(async (cuisineDoc) => {
      await deleteDoc(cuisineDoc.ref);
    });

    // products and its images
    const productsQuerySnapShot = await getDocs(
      collection(db, `stores/${params.storeId}/products`)
    );
    productsQuerySnapShot.forEach(async (productDoc) => {
      await deleteDoc(productDoc.ref);
      //  remove images from the storages
      const imagesArray = productDoc.data().images;
      if (imagesArray && Array.isArray(imagesArray)) {
        await Promise.all(
          imagesArray.map(async (image) => {
            const imageRef = ref(storage, image.url);
            await deleteObject(imageRef);
          })
        );
      }
    });
    // orders and its order items and its images
    const ordersQuerySnapShot = await getDocs(
      collection(db, `stores/${params.storeId}/orders`)
    );
    ordersQuerySnapShot.forEach(async (orderDoc) => {
      await deleteDoc(orderDoc.ref);
      const ordersItemArray = orderDoc.data().orderItems;
      if (ordersItemArray && Array.isArray(ordersItemArray)) {
        await Promise.all(
          ordersItemArray.map(async (orderItem) => {
            const itemImagesArray = orderItem.images;
            if (itemImagesArray && Array.isArray(itemImagesArray)) {
              await Promise.all(
                itemImagesArray.map(async (image) => {
                  const imageRef = ref(storage, image.url);
                  await deleteObject(imageRef);
                })
              );
            }
          })
        );
      }
    });


    // Finally delete this store
    await deleteDoc(docRef);

    return NextResponse.json({
      msg: "Store and all of its sub-collections deleted",
    });
  } catch (error) {
    console.log(`STORES_POST:${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
