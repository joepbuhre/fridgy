-- CreateTable
CREATE TABLE "ScannedItem" (
    "ID" SERIAL NOT NULL,
    "EAN" TEXT NOT NULL,
    "ScanId" INTEGER NOT NULL,

    CONSTRAINT "ScannedItem_pkey" PRIMARY KEY ("ID")
);
