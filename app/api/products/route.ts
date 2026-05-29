import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

//GET function to request information from database
export async function GET(){
    //fetching from products table
    const { data, error } = await supabase
        .from('products')
        .select('*')
    //if there's an error, NextResponse sends an error message
    if (error){
        return NextResponse.json({error: error.message}, {status: 500})
    }
    //if no error, returns data
    else{
        return NextResponse.json(data)
    }
}