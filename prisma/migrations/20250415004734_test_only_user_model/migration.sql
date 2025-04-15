/*
  Warnings:

  - You are about to drop the `properties` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_userId_fkey";

-- DropTable
DROP TABLE "properties";

-- DropTable
DROP TABLE "reviews";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "Status";
