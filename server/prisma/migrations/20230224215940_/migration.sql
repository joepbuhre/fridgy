-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Items" (
    "ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "EAN" TEXT NOT NULL,
    "ProductName" TEXT,
    "Merk" TEXT
);
INSERT INTO "new_Items" ("EAN", "ID", "Merk", "ProductName") SELECT "EAN", "ID", "Merk", "ProductName" FROM "Items";
DROP TABLE "Items";
ALTER TABLE "new_Items" RENAME TO "Items";
CREATE UNIQUE INDEX "Items_EAN_key" ON "Items"("EAN");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
