-- CreateTable
CREATE TABLE `t_account` (
    `acc_code` VARCHAR(191) NOT NULL,
    `acc_name` VARCHAR(191) NOT NULL,
    `acc_parent_code` VARCHAR(191) NULL,
    `acc_sublevel_format` INTEGER NOT NULL DEFAULT 0,
    `acc_type` VARCHAR(191) NOT NULL,
    `acc_category` VARCHAR(191) NULL,
    `acc_is_bank` BOOLEAN NOT NULL DEFAULT false,
    `acc_is_active` BOOLEAN NOT NULL DEFAULT true,
    `acc_notes` VARCHAR(191) NULL,
    `acc_created_by` VARCHAR(191) NULL,
    `acc_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `acc_updated_by` VARCHAR(191) NULL,
    `acc_updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`acc_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_account_bank` (
    `abk_acc_code` VARCHAR(191) NOT NULL,
    `abk_bank_name` VARCHAR(191) NULL,
    `abk_branch_name` VARCHAR(191) NULL,
    `abk_account_no` VARCHAR(191) NULL,
    `abk_sheba` VARCHAR(191) NULL,
    `abk_currency` VARCHAR(191) NOT NULL DEFAULT 'IRR',
    `abk_is_active` BOOLEAN NOT NULL DEFAULT true,
    `abk_is_pos` BOOLEAN NOT NULL DEFAULT true,
    `abk_is_check` BOOLEAN NOT NULL DEFAULT true,
    `abk_created_by` VARCHAR(191) NULL,
    `abk_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `abk_updated_by` VARCHAR(191) NULL,
    `abk_updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`abk_acc_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_person` (
    `per_code` VARCHAR(191) NOT NULL,
    `per_name` VARCHAR(191) NOT NULL,
    `per_last_name` VARCHAR(191) NOT NULL,
    `per_national_id` VARCHAR(191) NULL,
    `per_mobile` VARCHAR(191) NULL,
    `per_email` VARCHAR(191) NULL,
    `per_type_set` VARCHAR(191) NULL,
    `per_acc_code` VARCHAR(191) NULL,
    `per_is_active` BOOLEAN NOT NULL DEFAULT true,
    `per_notes` VARCHAR(191) NULL,
    `per_created_by` VARCHAR(191) NULL,
    `per_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `per_updated_by` VARCHAR(191) NULL,
    `per_updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`per_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_user_account` (
    `usr_per_code` VARCHAR(191) NOT NULL,
    `usr_username` VARCHAR(191) NOT NULL,
    `usr_password` VARCHAR(191) NOT NULL,
    `usr_role` VARCHAR(191) NOT NULL DEFAULT 'viewer',
    `usr_is_active` BOOLEAN NOT NULL DEFAULT true,
    `usr_last_login` DATETIME(3) NULL,
    `usr_avatar` VARCHAR(191) NULL,
    `usr_created_by` VARCHAR(191) NULL,
    `usr_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usr_updated_by` VARCHAR(191) NULL,
    `usr_updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `t_user_account_usr_username_key`(`usr_username`),
    PRIMARY KEY (`usr_per_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_person_account` (
    `pac_person_code` VARCHAR(191) NOT NULL,
    `pac_type` VARCHAR(191) NOT NULL,
    `pac_prj_code` VARCHAR(191) NOT NULL,
    `pac_acc_code` VARCHAR(191) NOT NULL,
    `pac_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`pac_person_code`, `pac_type`, `pac_prj_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_wallet` (
    `wlt_per_code` VARCHAR(191) NOT NULL,
    `wlt_balance` DOUBLE NOT NULL DEFAULT 0,
    `wlt_last_update` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `wlt_created_by` VARCHAR(191) NULL,
    `wlt_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `wlt_updated_by` VARCHAR(191) NULL,
    `wlt_updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`wlt_per_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_wallet_transaction` (
    `wtx_id` INTEGER NOT NULL AUTO_INCREMENT,
    `wtx_per_code` VARCHAR(191) NOT NULL,
    `wtx_type` VARCHAR(191) NOT NULL,
    `wtx_amount` DOUBLE NOT NULL,
    `wtx_datetime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `wtx_desc` VARCHAR(191) NULL,
    `wtx_ref_type` VARCHAR(191) NULL,
    `wtx_ref_code` VARCHAR(191) NULL,
    `wtx_jrn_code` VARCHAR(191) NULL,
    `wtx_created_by` VARCHAR(191) NULL,

    PRIMARY KEY (`wtx_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_project` (
    `prj_code` VARCHAR(191) NOT NULL,
    `prj_title` VARCHAR(191) NOT NULL,
    `prj_location` VARCHAR(191) NULL,
    `prj_type` VARCHAR(191) NOT NULL DEFAULT 'custom',
    `prj_model` VARCHAR(191) NOT NULL,
    `prj_start_date` DATETIME(3) NULL,
    `prj_end_date` DATETIME(3) NULL,
    `prj_nav` DOUBLE NULL,
    `prj_is_active` BOOLEAN NOT NULL DEFAULT true,
    `prj_created_by` VARCHAR(191) NULL,
    `prj_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `prj_updated_by` VARCHAR(191) NULL,
    `prj_updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`prj_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_unit` (
    `unt_prj_code` VARCHAR(191) NOT NULL,
    `unt_code` VARCHAR(191) NOT NULL,
    `unt_title` VARCHAR(191) NULL,
    `unt_type` VARCHAR(191) NOT NULL DEFAULT 'room',
    `unt_area` DOUBLE NULL,
    `unt_capacity` INTEGER NULL,
    `unt_floor` VARCHAR(191) NULL,
    `unt_block` VARCHAR(191) NULL,
    `unt_is_active` BOOLEAN NOT NULL DEFAULT true,
    `unt_notes` VARCHAR(191) NULL,
    `unt_created_by` VARCHAR(191) NULL,
    `unt_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `unt_updated_by` VARCHAR(191) NULL,
    `unt_updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`unt_prj_code`, `unt_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_reservation` (
    `res_id` INTEGER NOT NULL AUTO_INCREMENT,
    `res_prj_code` VARCHAR(191) NOT NULL,
    `res_unit_code` VARCHAR(191) NOT NULL,
    `res_per_code` VARCHAR(191) NOT NULL,
    `res_checkin` DATETIME(3) NOT NULL,
    `res_checkout` DATETIME(3) NOT NULL,
    `res_guest_count` INTEGER NOT NULL,
    `res_total_price` DOUBLE NOT NULL,
    `res_status` VARCHAR(191) NOT NULL,
    `res_created_by` VARCHAR(191) NULL,
    `res_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `res_updated_by` VARCHAR(191) NULL,
    `res_updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`res_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_shareholding` (
    `shr_id` INTEGER NOT NULL AUTO_INCREMENT,
    `shr_per_code` VARCHAR(191) NOT NULL,
    `shr_prj_code` VARCHAR(191) NOT NULL,
    `shr_shares` INTEGER NOT NULL,
    `shr_unit_price` DOUBLE NULL,
    `shr_total_value` DOUBLE NULL,
    `shr_from_date` DATETIME(3) NOT NULL,
    `shr_to_date` DATETIME(3) NULL,
    `shr_is_active` BOOLEAN NOT NULL DEFAULT true,
    `shr_notes` VARCHAR(191) NULL,
    `shr_created_by` VARCHAR(191) NULL,
    `shr_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `shr_updated_by` VARCHAR(191) NULL,
    `shr_updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `t_shareholding_shr_per_code_shr_prj_code_shr_from_date_key`(`shr_per_code`, `shr_prj_code`, `shr_from_date`),
    PRIMARY KEY (`shr_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_share_transfer` (
    `stf_id` INTEGER NOT NULL AUTO_INCREMENT,
    `stf_prj_code` VARCHAR(191) NOT NULL,
    `stf_from_person` VARCHAR(191) NOT NULL,
    `stf_to_person` VARCHAR(191) NOT NULL,
    `stf_shares` INTEGER NOT NULL,
    `stf_unit_price` DOUBLE NULL,
    `stf_total_value` DOUBLE NULL,
    `stf_transfer_date` DATETIME(3) NOT NULL,
    `stf_is_finalized` BOOLEAN NOT NULL DEFAULT false,
    `stf_desc` VARCHAR(191) NULL,
    `stf_created_by` VARCHAR(191) NULL,
    `stf_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `stf_updated_by` VARCHAR(191) NULL,
    `stf_updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`stf_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_share_profit` (
    `spt_id` INTEGER NOT NULL AUTO_INCREMENT,
    `spt_prj_code` VARCHAR(191) NOT NULL,
    `spt_per_code` VARCHAR(191) NOT NULL,
    `spt_year` INTEGER NOT NULL,
    `spt_period` VARCHAR(191) NULL,
    `spt_shares` INTEGER NOT NULL,
    `spt_unit_profit` DOUBLE NULL,
    `spt_total_profit` DOUBLE NULL,
    `spt_is_paid` BOOLEAN NOT NULL DEFAULT false,
    `spt_paid_at` DATETIME(3) NULL,
    `spt_jrn_code` VARCHAR(191) NULL,
    `spt_created_by` VARCHAR(191) NULL,
    `spt_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `spt_updated_by` VARCHAR(191) NULL,
    `spt_updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`spt_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_journal` (
    `jrn_code` VARCHAR(191) NOT NULL,
    `jrn_date` DATETIME(3) NOT NULL,
    `jrn_desc` VARCHAR(191) NULL,
    `jrn_type` VARCHAR(191) NOT NULL DEFAULT 'manual',
    `jrn_module` VARCHAR(191) NULL,
    `jrn_ref_code` VARCHAR(191) NULL,
    `jrn_is_posted` BOOLEAN NOT NULL DEFAULT false,
    `jrn_created_by` VARCHAR(191) NULL,
    `jrn_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `jrn_updated_by` VARCHAR(191) NULL,
    `jrn_updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`jrn_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_journal_detail` (
    `jrd_jrn_code` VARCHAR(191) NOT NULL,
    `jrd_line_no` INTEGER NOT NULL,
    `jrd_acc_code` VARCHAR(191) NOT NULL,
    `jrd_debit` DOUBLE NOT NULL DEFAULT 0,
    `jrd_credit` DOUBLE NOT NULL DEFAULT 0,
    `jrd_desc` VARCHAR(191) NULL,

    PRIMARY KEY (`jrd_jrn_code`, `jrd_line_no`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_config_item_def` (
    `cfg_item_key` VARCHAR(191) NOT NULL,
    `cfg_title` VARCHAR(191) NULL,
    `cfg_target_type` VARCHAR(191) NOT NULL,
    `cfg_account_type` VARCHAR(191) NOT NULL,
    `cfg_is_required` BOOLEAN NOT NULL DEFAULT true,
    `cfg_notes` VARCHAR(191) NULL,

    PRIMARY KEY (`cfg_item_key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_config_value` (
    `cfg_item_key` VARCHAR(191) NOT NULL,
    `cfg_context_id` VARCHAR(191) NOT NULL,
    `cfg_acc_code` VARCHAR(191) NOT NULL,
    `cfg_is_active` BOOLEAN NOT NULL DEFAULT true,
    `cfg_created_by` VARCHAR(191) NULL,
    `cfg_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`cfg_item_key`, `cfg_context_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_unit_tariff` (
    `utf_prj_code` VARCHAR(191) NOT NULL,
    `utf_unit_code` VARCHAR(191) NOT NULL,
    `utf_from_date` DATETIME(3) NOT NULL,
    `utf_to_date` DATETIME(3) NOT NULL,
    `utf_row_no` INTEGER NOT NULL,
    `utf_condition_expr` VARCHAR(191) NOT NULL,
    `utf_base_price` DOUBLE NOT NULL,
    `utf_max_base_guests` INTEGER NOT NULL,
    `utf_max_base_nights` INTEGER NOT NULL DEFAULT 2,
    `utf_on_expire_action` VARCHAR(191) NOT NULL DEFAULT 'none',
    `utf_expire_amount_per_night` DOUBLE NULL,
    `utf_created_by` VARCHAR(191) NULL,
    `utf_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `utf_updated_by` VARCHAR(191) NULL,
    `utf_updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`utf_prj_code`, `utf_unit_code`, `utf_from_date`, `utf_row_no`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_unit_tariff_extra` (
    `ute_prj_code` VARCHAR(191) NOT NULL,
    `ute_unit_code` VARCHAR(191) NOT NULL,
    `ute_from_date` DATETIME(3) NOT NULL,
    `ute_row_no` INTEGER NOT NULL,
    `ute_age_group` VARCHAR(191) NOT NULL,
    `ute_is_peak` BOOLEAN NOT NULL,
    `ute_price_per_night` DOUBLE NOT NULL,

    PRIMARY KEY (`ute_prj_code`, `ute_unit_code`, `ute_from_date`, `ute_row_no`, `ute_age_group`, `ute_is_peak`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_age_group` (
    `agp_code` VARCHAR(191) NOT NULL,
    `agp_title` VARCHAR(191) NULL,
    `agp_min_age` INTEGER NOT NULL,
    `agp_max_age` INTEGER NOT NULL,

    PRIMARY KEY (`agp_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_peak_period` (
    `pkp_label` VARCHAR(191) NOT NULL,
    `pkp_title` VARCHAR(191) NULL,
    `pkp_from_date` DATETIME(3) NOT NULL,
    `pkp_to_date` DATETIME(3) NOT NULL,
    `pkp_notes` VARCHAR(191) NULL,

    PRIMARY KEY (`pkp_label`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_reservation_usage` (
    `usu_prj_code` VARCHAR(191) NOT NULL,
    `usu_unit_code` VARCHAR(191) NOT NULL,
    `usu_from_date` DATETIME(3) NOT NULL,
    `usu_row_no` INTEGER NOT NULL,
    `usu_res_id` INTEGER NOT NULL,
    `usu_condition_expr` VARCHAR(191) NULL,
    `usu_guest_count` INTEGER NOT NULL,
    `usu_nights_used` INTEGER NOT NULL,
    `usu_extra_guests` INTEGER NOT NULL,
    `usu_total_extra_fee` DOUBLE NOT NULL,
    `usu_usage_status` VARCHAR(191) NOT NULL DEFAULT 'used',
    `usu_converted_amount` DOUBLE NULL,
    `usu_evaluated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`usu_prj_code`, `usu_unit_code`, `usu_from_date`, `usu_row_no`, `usu_res_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_user_log` (
    `ulg_id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulg_per_code` VARCHAR(191) NOT NULL,
    `ulg_action` VARCHAR(191) NOT NULL,
    `ulg_table_name` VARCHAR(191) NOT NULL,
    `ulg_record_key` VARCHAR(191) NOT NULL,
    `ulg_desc` VARCHAR(191) NULL,
    `ulg_ip_address` VARCHAR(191) NULL,
    `ulg_timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`ulg_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_theme_settings` (
    `ths_id` INTEGER NOT NULL AUTO_INCREMENT,
    `ths_category` VARCHAR(191) NOT NULL,
    `ths_key` VARCHAR(191) NOT NULL,
    `ths_value` JSON NULL,
    `ths_language_code` VARCHAR(191) NOT NULL DEFAULT 'fa',
    `ths_is_active` BOOLEAN NOT NULL DEFAULT true,
    `ths_created_by` VARCHAR(191) NULL,
    `ths_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ths_updated_by` VARCHAR(191) NULL,
    `ths_updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `t_theme_settings_ths_category_ths_key_ths_language_code_key`(`ths_category`, `ths_key`, `ths_language_code`),
    PRIMARY KEY (`ths_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_theme_languages` (
    `thl_code` VARCHAR(191) NOT NULL,
    `thl_name` VARCHAR(191) NOT NULL,
    `thl_native_name` VARCHAR(191) NULL,
    `thl_direction` VARCHAR(191) NOT NULL DEFAULT 'ltr',
    `thl_calendar` VARCHAR(191) NOT NULL DEFAULT 'gregorian',
    `thl_font_primary` VARCHAR(191) NOT NULL DEFAULT 'Arial',
    `thl_font_fallback` VARCHAR(191) NOT NULL DEFAULT 'Tahoma, Arial, sans-serif',
    `thl_translation_file` VARCHAR(191) NULL,
    `thl_date_format` VARCHAR(191) NOT NULL DEFAULT 'MM/DD/YYYY',
    `thl_time_format` VARCHAR(191) NOT NULL DEFAULT 'HH:mm',
    `thl_number_format` VARCHAR(191) NOT NULL DEFAULT 'en-US',
    `thl_currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
    `thl_currency_symbol` VARCHAR(191) NOT NULL DEFAULT '$',
    `thl_is_active` BOOLEAN NOT NULL DEFAULT true,
    `thl_is_default` BOOLEAN NOT NULL DEFAULT false,
    `thl_created_by` VARCHAR(191) NULL,
    `thl_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `thl_updated_by` VARCHAR(191) NULL,
    `thl_updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`thl_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_theme_links` (
    `thl_id` INTEGER NOT NULL AUTO_INCREMENT,
    `thl_type` VARCHAR(191) NOT NULL,
    `thl_title` VARCHAR(191) NOT NULL,
    `thl_icon` VARCHAR(191) NULL,
    `thl_image_path` VARCHAR(191) NULL,
    `thl_url` VARCHAR(191) NOT NULL,
    `thl_sort_order` INTEGER NOT NULL DEFAULT 0,
    `thl_is_active` BOOLEAN NOT NULL DEFAULT true,
    `thl_created_by` VARCHAR(191) NULL,
    `thl_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `thl_updated_by` VARCHAR(191) NULL,
    `thl_updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`thl_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_theme_templates` (
    `tht_id` INTEGER NOT NULL AUTO_INCREMENT,
    `tht_name` VARCHAR(191) NOT NULL,
    `tht_description` VARCHAR(191) NULL,
    `tht_preview_image` VARCHAR(191) NULL,
    `tht_settings` JSON NOT NULL,
    `tht_is_default` BOOLEAN NOT NULL DEFAULT false,
    `tht_is_active` BOOLEAN NOT NULL DEFAULT true,
    `tht_created_by` VARCHAR(191) NULL,
    `tht_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tht_updated_by` VARCHAR(191) NULL,
    `tht_updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`tht_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `t_account_bank` ADD CONSTRAINT `t_account_bank_abk_acc_code_fkey` FOREIGN KEY (`abk_acc_code`) REFERENCES `t_account`(`acc_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_user_account` ADD CONSTRAINT `t_user_account_usr_per_code_fkey` FOREIGN KEY (`usr_per_code`) REFERENCES `t_person`(`per_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_person_account` ADD CONSTRAINT `t_person_account_pac_person_code_fkey` FOREIGN KEY (`pac_person_code`) REFERENCES `t_person`(`per_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_person_account` ADD CONSTRAINT `t_person_account_pac_prj_code_fkey` FOREIGN KEY (`pac_prj_code`) REFERENCES `t_project`(`prj_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_wallet` ADD CONSTRAINT `t_wallet_wlt_per_code_fkey` FOREIGN KEY (`wlt_per_code`) REFERENCES `t_person`(`per_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_wallet_transaction` ADD CONSTRAINT `t_wallet_transaction_wtx_per_code_fkey` FOREIGN KEY (`wtx_per_code`) REFERENCES `t_person`(`per_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_unit` ADD CONSTRAINT `t_unit_unt_prj_code_fkey` FOREIGN KEY (`unt_prj_code`) REFERENCES `t_project`(`prj_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_reservation` ADD CONSTRAINT `t_reservation_res_per_code_fkey` FOREIGN KEY (`res_per_code`) REFERENCES `t_person`(`per_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_reservation` ADD CONSTRAINT `t_reservation_res_prj_code_fkey` FOREIGN KEY (`res_prj_code`) REFERENCES `t_project`(`prj_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_shareholding` ADD CONSTRAINT `t_shareholding_shr_per_code_fkey` FOREIGN KEY (`shr_per_code`) REFERENCES `t_person`(`per_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_shareholding` ADD CONSTRAINT `t_shareholding_shr_prj_code_fkey` FOREIGN KEY (`shr_prj_code`) REFERENCES `t_project`(`prj_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_share_transfer` ADD CONSTRAINT `t_share_transfer_stf_prj_code_fkey` FOREIGN KEY (`stf_prj_code`) REFERENCES `t_project`(`prj_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_share_transfer` ADD CONSTRAINT `t_share_transfer_stf_from_person_fkey` FOREIGN KEY (`stf_from_person`) REFERENCES `t_person`(`per_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_share_transfer` ADD CONSTRAINT `t_share_transfer_stf_to_person_fkey` FOREIGN KEY (`stf_to_person`) REFERENCES `t_person`(`per_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_share_profit` ADD CONSTRAINT `t_share_profit_spt_per_code_fkey` FOREIGN KEY (`spt_per_code`) REFERENCES `t_person`(`per_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_share_profit` ADD CONSTRAINT `t_share_profit_spt_prj_code_fkey` FOREIGN KEY (`spt_prj_code`) REFERENCES `t_project`(`prj_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_journal_detail` ADD CONSTRAINT `t_journal_detail_jrd_jrn_code_fkey` FOREIGN KEY (`jrd_jrn_code`) REFERENCES `t_journal`(`jrn_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_journal_detail` ADD CONSTRAINT `t_journal_detail_jrd_acc_code_fkey` FOREIGN KEY (`jrd_acc_code`) REFERENCES `t_account`(`acc_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_config_value` ADD CONSTRAINT `t_config_value_cfg_acc_code_fkey` FOREIGN KEY (`cfg_acc_code`) REFERENCES `t_account`(`acc_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_user_log` ADD CONSTRAINT `t_user_log_ulg_per_code_fkey` FOREIGN KEY (`ulg_per_code`) REFERENCES `t_person`(`per_code`) ON DELETE RESTRICT ON UPDATE CASCADE;
