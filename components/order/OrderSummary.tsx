"use client"
import { useStore } from "@/src/store"
import ProductDetails from "./ProductDetails"
import { useMemo } from "react"
import { formatCurrency } from "@/src/utils"
import { createOrder } from "@/actions/create-order-action"
import { OrderSchema } from "@/src/schema"
import { toast } from "react-toastify"


export default function OrderSummary() {
  const { order, clearOrder } = useStore()
  const total = useMemo(() => order.reduce((total, item) => total + item.subtotal, 0), [order])

  const handleCreateOrder = async (formData: FormData) => {
    const data = {
      name: formData.get('name'),
      total,
      order
    }

    const result = OrderSchema.safeParse(data)
    console.log(result)
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        toast.error(issue.message)
      })
      return
    }

    const response = await createOrder(data)
    if(response?.errors) {
        response?.errors.forEach(issue => {
          toast.error(issue.message)
      })
    }

    toast.success('Pedido realizado correctamente...')
    clearOrder()
  }

  return (
    <aside className="sm:h-screen  sm:w-64 xl:w-96 px-3 relative">
      <h1 className="text-4xl text-center text-white font-black sticky top-0 py-3 bg-gray-500">
        Mi Pedido
      </h1>

      <div className="h-[calc(100vh-280px)] sm:overflow-y-scroll">        {order.length === 0
          ? (
            <p className="text-center my-10">El Carrito esta vacio</p>
          ): (
            <>
              <div className="mt-5">
                  {order.map(item => (
                    <ProductDetails 
                      key={item.id}
                      item={item}
                    />
                  ))}
              </div>

            </>
          )}
        </div>

        <div className="bg-gray-500 flex flex-col sticky bottom-0 mt-2 pt-1">
          
          <p className="text-2xl mt-2 text-center bg-amber-500 py-3">
            Total a pagar: {''}
            <span className="font-bold">{formatCurrency(total)}</span>
          </p>

          <form 
            className="w-full mt-10 space-y-5"
            action={handleCreateOrder}
          >
            <input 
              type="text"
              placeholder="Tu Nombre"
              className="bg-white border border-gray-100 p-2 w-full rounded-md"
              name="name"
            />

            <input 
              type="submit"
              className="py-2 rounded uppercase text-white bg-indigo-600 w-full text-center cursor-pointer font-bold"
              value='Confirmar Pedido'
              
            />
          </form>
        </div>
      
    </aside>
  )
}
