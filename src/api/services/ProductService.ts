import { PrismaClient } from "@prisma/client";
import { ProductInput } from "../../types/input-types/ProductInput.js";


const prisma = new PrismaClient();

export async function getAll() {
    try {
        const products = await prisma.products.findMany({});
        return(products);
      } catch (error) {
        console.error(error);
        return({ error: "Failed to retrieve products" });
      }
}

export async function getById(id: any) {
    try {
        const product = await prisma.products.findUnique({
          where: { ProductID: parseInt(id) },
        });
  
        if (!product) {
          return({ error: "Product not found" });
        }
  
        return(product);
      } catch (error) {
        console.error(error);
        return({ error: "Failed to retrieve product" });
      }
}

export async function Add(product: ProductInput) {
    const {
        ProductName,
        Description,
        Price,
        StockQuantity,
        CategoryID,
      } = product;
    
      try {
        const newProduct = await prisma.products.create({
          data: {
            ProductName,
        Description,
        Price,
        StockQuantity,
        CategoryID,
          },
        });
    
        return(newProduct);
      } catch (error) {
        console.error(error);
        return({ error: "Failed to create product" });
      }
}

export async function Update(product: ProductInput, id: string) {
    const {ProductName,
        Description,
        Price,
        StockQuantity,
        CategoryID, } =
        product
    try {
        const updatedProduct = await prisma.products.update({
            where: { ProductID: parseInt(id) },
            data: { ProductName,
                Description,
                Price,
                StockQuantity,
                CategoryID, },
        });
        return (updatedProduct);
    } catch (error) {
        console.error(error);
        return ({ error: "Failed to update Product" });
    }
}

export async function Delete(id: any) {
    try {
        return await prisma.products.delete({
            where: { ProductID: parseInt(id) },
        });
    } catch (error) {
        console.error(error);
        return ({ error: "Failed to delete Product" });
    }
}


