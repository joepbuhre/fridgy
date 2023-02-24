/*
  Warnings:

  - Added the required column `ItemId` to the `ItemsInventory` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Items" (
    "ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "EAN" TEXT NOT NULL,
    "ProductName" TEXT NOT NULL,
    "Merk" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ItemsInventory" (
    "ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "EAN" TEXT NOT NULL,
    "Stock" INTEGER NOT NULL,
    "Expiry" DATETIME NOT NULL,
    "LocationID" INTEGER NOT NULL,
    "ItemId" INTEGER NOT NULL,
    CONSTRAINT "ItemsInventory_LocationID_fkey" FOREIGN KEY ("LocationID") REFERENCES "Locations" ("ID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ItemsInventory_ItemId_fkey" FOREIGN KEY ("ItemId") REFERENCES "Items" ("ID") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ItemsInventory" ("EAN", "Expiry", "ID", "LocationID", "Stock") SELECT "EAN", "Expiry", "ID", "LocationID", "Stock" FROM "ItemsInventory";
DROP TABLE "ItemsInventory";
ALTER TABLE "new_ItemsInventory" RENAME TO "ItemsInventory";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Items_EAN_key" ON "Items"("EAN");
