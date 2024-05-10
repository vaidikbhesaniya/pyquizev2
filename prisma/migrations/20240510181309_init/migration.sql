/*
  Warnings:

  - Added the required column `issubmitted` to the `data` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "data" ADD COLUMN     "issubmitted" BOOLEAN NOT NULL;
