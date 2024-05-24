/*
  Warnings:

  - You are about to drop the column `content` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Post` table. All the data in the column will be lost.
  - Added the required column `clickedActivityButton` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clickedProjectButton` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `formattedStartTime` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `formattedendtime` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `staffname` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timerDisplay` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timerdate` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "content",
DROP COLUMN "title",
ADD COLUMN     "clickedActivityButton" TEXT NOT NULL,
ADD COLUMN     "clickedProjectButton" TEXT NOT NULL,
ADD COLUMN     "formattedStartTime" TEXT NOT NULL,
ADD COLUMN     "formattedendtime" TEXT NOT NULL,
ADD COLUMN     "staffname" TEXT NOT NULL,
ADD COLUMN     "timerDisplay" TEXT NOT NULL,
ADD COLUMN     "timerdate" TEXT NOT NULL;
