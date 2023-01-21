/*
  Warnings:

  - You are about to drop the `ItemsDetails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "ItemsDetails_EAN_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ItemsDetails";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ItemsInventory" (
    "ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "EAN" TEXT NOT NULL,
    "Stock" INTEGER NOT NULL,
    "Expiry" DATETIME NOT NULL
);
INSERT INTO "new_ItemsInventory" ("EAN", "Expiry", "ID", "Stock") SELECT "EAN", "Expiry", "ID", "Stock" FROM "ItemsInventory";
DROP TABLE "ItemsInventory";
ALTER TABLE "new_ItemsInventory" RENAME TO "ItemsInventory";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
