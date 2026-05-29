'use client'; //marks the file as a client-side component

import Link from 'next/link'

//react component is just a function that returns HTML/JSX
export default function Navbar(){
    return(
        <nav>
            {/* logo */}
            <Link href = "/">Ochar</Link>
            <ul>
                <li><Link href = "/shop">Shop</Link></li>
                <li><Link href = "/#ingredients">Ingredients</Link></li>
                <li><Link href = "/#contact">Contact</Link></li>
            </ul>
        </nav>
    )
}
