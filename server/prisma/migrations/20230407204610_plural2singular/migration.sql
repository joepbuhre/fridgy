/*
  Warnings:

  - You are about to drop the `Items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemsInventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Locations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ItemsInventory" DROP CONSTRAINT "ItemsInventory_ItemId_fkey";

-- DropForeignKey
ALTER TABLE "ItemsInventory" DROP CONSTRAINT "ItemsInventory_LocationID_fkey";

-- DropTable
DROP TABLE "Items";

-- DropTable
DROP TABLE "ItemsInventory";

-- DropTable
DROP TABLE "Locations";

-- CreateTable
CREATE TABLE "Location" (
    "ID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "ItemInventory" (
    "ID" SERIAL NOT NULL,
    "EAN" TEXT NOT NULL,
    "Stock" INTEGER NOT NULL,
    "Expiry" TIMESTAMP(3) NOT NULL,
    "LocationID" INTEGER NOT NULL,
    "ItemId" INTEGER NOT NULL,

    CONSTRAINT "ItemInventory_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Item" (
    "ID" SERIAL NOT NULL,
    "EAN" TEXT NOT NULL,
    "ProductName" TEXT,
    "Merk" TEXT,
    "Reorder" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_Name_key" ON "Location"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Item_EAN_key" ON "Item"("EAN");

-- AddForeignKey
ALTER TABLE "ItemInventory" ADD CONSTRAINT "ItemInventory_LocationID_fkey" FOREIGN KEY ("LocationID") REFERENCES "Location"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemInventory" ADD CONSTRAINT "ItemInventory_ItemId_fkey" FOREIGN KEY ("ItemId") REFERENCES "Item"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;
