-- CreateTable
CREATE TABLE "Locations" (
    "ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ItemsInventory" (
    "ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "EAN" TEXT NOT NULL,
    "Stock" INTEGER NOT NULL,
    "Expiry" DATETIME NOT NULL,
    "LocationID" INTEGER NOT NULL,
    CONSTRAINT "ItemsInventory_LocationID_fkey" FOREIGN KEY ("LocationID") REFERENCES "Locations" ("ID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Locations_Name_key" ON "Locations"("Name");
