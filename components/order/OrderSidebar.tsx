import { prisma } from "@/src/lib/prisma"
import CategoryIcon from "../ui/CategoryIcon"
import Logo from "../ui/Logo"


async function getCategories() {
  return await prisma.category.findMany()
}

export default async function OrderSidebar() {

  const categories = await getCategories()

  return (
    <div>
        <aside className="sm:w-72 sm:h-screen bg-white">
            <Logo />
            <nav className="">
              {categories.map(category => (
                <CategoryIcon 
                  key={category.id}
                  category={category}
                />
              ))}
            </nav>
        </aside>
    </div>
  )
}
