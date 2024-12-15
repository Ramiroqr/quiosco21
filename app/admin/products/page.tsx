import ProductPagination from "@/components/products/ProductPagination";
import ProductSearchForm from "@/components/products/ProductSearchForm";
import ProductTable from "@/components/products/ProductsTable";
import Heading from "@/components/ui/Heading";
import { prisma } from "@/src/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

async function productCount() {
  return await prisma.product.count()
}

async function getProducts(pages: number, pageSize: number) {
  const skip = (pages - 1) * pageSize

  const products = await prisma.product.findMany({
    take: pageSize,
    skip,
    include: {
      category: true
    }
  })

  return products
}

export type ProductsWithCategory = Awaited<ReturnType<typeof getProducts>>

export default async function ProductsPage({searchParams}: {searchParams: {page: string}}) {
  const { page } = await searchParams
  const pages = +page || 1
  const pageSize = 10
  
  if(pages < 0) redirect('/admin/products')
  
  const productsData = getProducts(pages, pageSize)
  const totalProductsData = productCount()
  const [products, totalProducts] = await Promise.all([productsData, totalProductsData])
  const totalPages = Math.ceil(totalProducts / pageSize)

  if(pages > totalPages) redirect('/admin/products')

  return (
    <>
        <Heading>Administrar Productos</Heading>

        <div className="flex flex-col lg:flex-row lg:justify-between gap-8">
          <Link
            href={'/admin/products/new'}
            className="bg-amber-500 w-full lg:w-auto text-xl px-10 py-2.5 text-center font-bold cursor-pointer"
          >Crear Producto</Link>

          <ProductSearchForm />
        </div>

        <ProductTable 
          products={products}
        />

        <ProductPagination 
          page={pages}
          totalPages={totalPages}
        />
    </>
  )
}
