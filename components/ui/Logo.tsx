import Image from "next/image";


export default function Logo() {
  return (
    <div className="flex justify-center">
        <div className="relative w-40 h-40 my-2">
            <Image 
                fill
                alt="Logotipo Fresh Coffee"
                src='/logo.svg'
                loading="eager" 
                priority={true}
            />
        </div>
    </div>
  )
}
