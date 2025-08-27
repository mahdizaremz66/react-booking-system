import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// دفتر کل (v_general_ledger)
export const getGeneralLedger = async () => {
  return prisma.$queryRaw`SELECT * FROM v_general_ledger`;
};
// دفتر تفصیلی شخص (v_person_ledger)
export const getPersonLedger = async () => {
  return prisma.$queryRaw`SELECT * FROM v_person_ledger`;
};
// تراز آزمایشی (v_trial_balance)
export const getTrialBalance = async () => {
  return prisma.$queryRaw`SELECT * FROM v_trial_balance`;
};
// مانده حساب اشخاص (v_person_balance)
export const getPersonBalance = async () => {
  return prisma.$queryRaw`SELECT * FROM v_person_balance`;
};
// نگاشت تنظیمات پیکربندی (v_config_map)
export const getConfigMap = async () => {
  return prisma.$queryRaw`SELECT * FROM v_config_map`;
};
// خلاصه رزرو (v_reservation_summary)
export const getReservationSummary = async () => {
  return prisma.$queryRaw`SELECT * FROM v_reservation_summary`;
};
// مصرف تعرفه (v_tariff_consumption)
export const getTariffConsumption = async () => {
  return prisma.$queryRaw`SELECT * FROM v_tariff_consumption`;
};
// تعرفه مهمان اضافه بر اساس سن (v_tariff_extra_by_age)
export const getTariffExtraByAge = async () => {
  return prisma.$queryRaw`SELECT * FROM v_tariff_extra_by_age`;
};
// مانده کیف پول (v_wallet_balance)
export const getWalletBalance = async () => {
  return prisma.$queryRaw`SELECT * FROM v_wallet_balance`;
};
// تاریخچه تراکنش‌های کیف پول (v_wallet_txn_history)
export const getWalletTxnHistory = async () => {
  return prisma.$queryRaw`SELECT * FROM v_wallet_txn_history`;
};
// سود تخصیص یافته (v_profit_distribution)
export const getProfitDistribution = async () => {
  return prisma.$queryRaw`SELECT * FROM v_profit_distribution`;
};
// لاگ عملیاتی کاربران (v_user_log_audit)
export const getUserLogAudit = async () => {
  return prisma.$queryRaw`SELECT * FROM v_user_log_audit`;
};
// نقش افراد در پروژه‌ها (v_project_person_roles)
export const getProjectPersonRoles = async () => {
  return prisma.$queryRaw`SELECT * FROM v_project_person_roles`;
};
// گزارش مدیریتی رزرو (v_reservation_report_summary)
export const getReservationReportSummary = async () => {
  return prisma.$queryRaw`SELECT * FROM v_reservation_report_summary`;
}; 