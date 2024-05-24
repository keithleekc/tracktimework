/*
  Warnings:

  - Changed the type of `formattedStartTime` on the `Post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `formattedendtime` on the `Post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `timerdate` on the `Post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "formattedStartTime",
ADD COLUMN     "formattedStartTime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "formattedendtime",
ADD COLUMN     "formattedendtime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "timerdate",
ADD COLUMN     "timerdate" TIMESTAMP(3) NOT NULL;
