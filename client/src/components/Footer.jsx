import React from 'react'
import logo from '../assets/logo.png'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 text-white py-10 px-6 mt-auto">
        <div className='max-w mx-auto flex flex-col items-center space-y-6'> 
            <div className='flex flex-col items-center'>
                <img src={logo} alt="Logo CEP" className='h-15 w-auto' />
                <p className='text-sm mt-2 text-white/65 text-center'>
                Coordinacion de extension profesional
                </p>
            </div>
           
            <br />
          
            <p className="text-xs text-white/70 text-center">
              © {new Date().getFullYear()} CEP. Todos los derechos reservados.
            </p>
        </div>
     </footer>   
  )
}
