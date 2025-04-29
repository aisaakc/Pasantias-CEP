import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 text-white py-10 px-6 mt-auto">
        <div className='max-w mx-auto flex flex-col items-center space-y-6'> 
            <div className='flex flex-col items-center'>
                <img src="" alt="" className='h-12 w-auto' />
                <p className='text-sm mt-2 text-white/80 text-center'>
                Coordinacion de extension profesional
                </p>
            </div>
            <div>
                <a href="" aria-label='Facebook' className='hover:text-blue-300 transition-colors'>

                </a>
            </div>
            <div>
                <a href="" aria-label='Facebook' className='hover:text-blue-300 transition-colors'>

                </a>
            </div>
            <div>
                <a href="" aria-label='Facebook' className='hover:text-blue-300 transition-colors'>

                </a>
            </div>
            <p className="text-xs text-white/70 text-center">
              © {new Date().getFullYear()} CEP. Todos los derechos reservados.
            </p>
        </div>
     </footer>   
  )
}
