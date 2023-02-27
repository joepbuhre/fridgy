-- CreateTable
CREATE TABLE "Locations" (
    "ID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,

    CONSTRAINT "Locations_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "ItemsInventory" (
    "ID" SERIAL NOT NULL,
    "EAN" TEXT NOT NULL,
    "Stock" INTEGER NOT NULL,
    "Expiry" TIMESTAMP(3) NOT NULL,
    "LocationID" INTEGER NOT NULL,
    "ItemId" INTEGER NOT NULL,

    CONSTRAINT "ItemsInventory_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Items" (
    "ID" SERIAL NOT NULL,
    "EAN" TEXT NOT NULL,
    "ProductName" TEXT,
    "Merk" TEXT,

    CONSTRAINT "Items_pkey" PRIMARY KEY ("ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Locations_Name_key" ON "Locations"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Items_EAN_key" ON "Items"("EAN");

-- AddForeignKey
ALTER TABLE "ItemsInventory" ADD CONSTRAINT "ItemsInventory_LocationID_fkey" FOREIGN KEY ("LocationID") REFERENCES "Locations"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemsInventory" ADD CONSTRAINT "ItemsInventory_ItemId_fkey" FOREIGN KEY ("ItemId") REFERENCES "Items"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;
