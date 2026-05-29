import Link from 'next/link'

export default function HeroSection(){
    return(
        <section>
            <h1>delicious, homemade, all-natural soap</h1>
            <p>from the tonoyans to you</p>
            <Link href = "/shop">shop now</Link>
        </section>
    )
}