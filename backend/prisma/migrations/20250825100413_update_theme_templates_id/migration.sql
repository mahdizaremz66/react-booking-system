/*
  Warnings:

  - The primary key for the `t_theme_templates` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `t_theme_templates` DROP PRIMARY KEY,
    ADD COLUMN `tht_is_system` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `tht_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`tht_id`);
