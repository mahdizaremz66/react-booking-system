/*
  Warnings:

  - You are about to drop the column `thl_number_format` on the `t_theme_languages` table. All the data in the column will be lost.
  - You are about to drop the column `thl_time_format` on the `t_theme_languages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `t_theme_languages` DROP COLUMN `thl_number_format`,
    DROP COLUMN `thl_time_format`;
