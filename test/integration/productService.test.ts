import { describe, it, expect, afterEach } from "vitest";
import { createProductService } from "../../src/api/services/ProductService";
import { PrismaClient } from "@prisma/client";
import { ProductInput } from "../../src/types/input-types/ProductInput";

const prisma = new PrismaClient();

describe("Product Service - Integration Tests", () => {
  const sqlService = createProductService("sql");

  // Testdata
  const sampleProduct: ProductInput = {
    ProductName: "Test Product",
    Description: "A product used for testing",
    Price: 100.0,
    StockQuantity: 10,
    CategoryID: 1,
  };

  // Liste over oprettede produkter til oprydning
  const createdProductIds: number[] = [];

  // Ryd op efter hver test
  afterEach(async () => {
    // Slet nyoprettede produkter
    for (const productId of createdProductIds) {
      try {
        await prisma.products.delete({
          where: { ProductID: productId },
        });
      } catch (error) {
        console.error(`Error cleaning up product with ID ${productId}:`, error);
      }
    }
    createdProductIds.length = 0; // Tøm listen
  });

  describe("SQL Strategy (Prisma)", () => {
    it("should add and retrieve a product", async () => {
        // Tilføj produkt
        const createdProduct = await sqlService.add(sampleProduct);
        createdProductIds.push(createdProduct.ProductID); // Tilføj til oprydningslisten
      
        expect(createdProduct).toHaveProperty("ProductID");
      

        const fetchedProduct = await sqlService.getById({
          id: createdProduct.ProductID,
        });
        
      
        expect(fetchedProduct).toMatchObject({
          ProductName: sampleProduct.ProductName,
          Description: sampleProduct.Description,
          Price: sampleProduct.Price,
          StockQuantity: sampleProduct.StockQuantity,
          CategoryID: sampleProduct.CategoryID,
        });
      });
      

      it("should update a product", async () => {
        // Tilføj produkt
        const createdProduct = await sqlService.add(sampleProduct);
        createdProductIds.push(createdProduct.ProductID); // Tilføj til oprydningslisten
      
        // Opdater produktet
        const updatedData = { ...sampleProduct, Price: 150.0, StockQuantity: 20 };
        const updatedProduct = await sqlService.update(
          { id: createdProduct.ProductID },
          updatedData
        );
      
        expect(updatedProduct).toMatchObject({
          Price: updatedData.Price, // Konverter til tal
          StockQuantity: updatedData.StockQuantity,
        });
      
        // Hent det opdaterede produkt
        const fetchedProduct = await sqlService.getById({
          id: createdProduct.ProductID,
        });
      
        expect(fetchedProduct).toMatchObject({
          ...updatedData,
          Price: Number(updatedData.Price), // Konverter til tal
        });
      });
      

    it("should delete a product", async () => {
      // Tilføj produkt
      const createdProduct = await sqlService.add(sampleProduct);
      createdProductIds.push(createdProduct.ProductID); // Tilføj til oprydningslisten

      // Slet produkt
      const deleteResult = await sqlService.delete({
        id: createdProduct.ProductID,
      });

      expect(deleteResult).toHaveProperty("ProductID", createdProduct.ProductID);

      // Tjek at produktet ikke længere findes
      const fetchedProduct = await sqlService.getById({
        id: createdProduct.ProductID,
      });

      expect(fetchedProduct).toHaveProperty("error", "Product not found");

      // Fjern fra oprydningslisten, da produktet allerede er slettet
      createdProductIds.pop();
    });
  });
});
