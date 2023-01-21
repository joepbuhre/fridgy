-- CreateTable
CREATE TABLE "ItemsInventory" (
    "ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "EAN" TEXT NOT NULL,
    "Stock" INTEGER NOT NULL,
    "Expiry" DATETIME NOT NULL,
    CONSTRAINT "ItemsInventory_EAN_fkey" FOREIGN KEY ("EAN") REFERENCES "ItemsDetails" ("EAN") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ItemsDetails" (
    "EAN" TEXT NOT NULL,
    "Details" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "ItemsDetails_EAN_key" ON "ItemsDetails"("EAN");
