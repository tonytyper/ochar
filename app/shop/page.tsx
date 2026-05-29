import ProductCard from "@/app/components/productcard"
import {Product} from '@/app/components/productcard'


export default async function ShopPage(){
    //fetching from API route
    const response = await fetch('http://localhost:3000/api/products')
    
    //parsing json body from response
    const products = await response.json() as Product[]

    //displaying product cards
    return(
        <main>
            <h1>ochar soap co. <br /><br/></h1>

            {/* mapping over each product and rendering
            a product card for each one*/}
            <div>
                {products.map((product)=>
                (<ProductCard key={product.id} product={product} />))}
            </div>
        </main>
    )
}