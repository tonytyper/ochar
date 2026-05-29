//receiving a single product object
//as a prop and displaying it

//defining fields for each product card
export interface Product{
    id: string
    name: string
    description: string
    price: number
    image_url: string
    in_stock: boolean
    created_at: string
}

//accepts a product of type Product as a prop
export default function ProductCard({product}: {product: Product}){
    return(
        <div>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <span>${product.price}</span>
        </div>
    )
}

