import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 شروع وارد کردن داده‌های اولیه...');

  // ایجاد حساب‌های پایه
  console.log('📊 ایجاد حساب‌های پایه...');
  
  const accounts = [
    // کل عمومی
    { accCode: '01', accName: 'کل عمومی', accParentCode: null, accType: 'neutral', accCategory: 'asset', accSublevelFormat: 1 },
    { accCode: '01/001', accName: 'معین عمومی', accParentCode: '01', accType: 'neutral', accCategory: 'asset', accSublevelFormat: 3 },
    { accCode: '01/001/001', accName: 'افتتاحیه دوره مالی', accParentCode: '01/001', accType: 'neutral', accCategory: 'asset', accSublevelFormat: 0 },

    // دارایی
    { accCode: '02', accName: 'دارایی', accParentCode: null, accType: 'debit', accCategory: 'asset', accSublevelFormat: 1 },
    { accCode: '02/001', accName: 'دارایی‌های جاری', accParentCode: '02', accType: 'debit', accCategory: 'asset', accSublevelFormat: 1 },
    { accCode: '02/001/001', accName: 'اسناد دریافتنی', accParentCode: '02/001', accType: 'debit', accCategory: 'asset', accSublevelFormat: 0 },
    { accCode: '02/001/002', accName: 'بانک‌ها', accParentCode: '02/001', accType: 'debit', accCategory: 'asset', accSublevelFormat: 1 },
    { accCode: '02/001/002/001', accName: 'بانک 1', accParentCode: '02/001/002', accType: 'debit', accCategory: 'asset', accSublevelFormat: 0 },
    { accCode: '02/001/003', accName: 'صندوق', accParentCode: '02/001', accType: 'debit', accCategory: 'asset', accSublevelFormat: 1 },
    { accCode: '02/001/003/001', accName: 'صندوق', accParentCode: '02/001/003', accType: 'debit', accCategory: 'asset', accSublevelFormat: 0 },
    { accCode: '02/001/004', accName: 'تنخواه گردان', accParentCode: '02/001', accType: 'debit', accCategory: 'asset', accSublevelFormat: 0 },
    { accCode: '02/002', accName: 'جاری اشخاص و شرکتها', accParentCode: '02', accType: 'debit', accCategory: 'asset', accSublevelFormat: 0 },
    { accCode: '02/003', accName: 'متفرقه', accParentCode: '02', accType: 'debit', accCategory: 'asset', accSublevelFormat: 0 },
    { accCode: '02/004', accName: 'موجودی کالا', accParentCode: '02', accType: 'debit', accCategory: 'asset', accSublevelFormat: 1 },
    { accCode: '02/004/001', accName: 'موجودی جنسی', accParentCode: '02/004', accType: 'debit', accCategory: 'asset', accSublevelFormat: 0 },
    { accCode: '02/005', accName: 'دارایی‌های ثابت', accParentCode: '02', accType: 'debit', accCategory: 'asset', accSublevelFormat: 1 },
    { accCode: '02/005/001', accName: 'دارایی ثابت', accParentCode: '02/005', accType: 'debit', accCategory: 'asset', accSublevelFormat: 0 },
    { accCode: '02/005/002', accName: 'اموال و اثاثه', accParentCode: '02/005', accType: 'debit', accCategory: 'asset', accSublevelFormat: 0 },

    // بدهی
    { accCode: '03', accName: 'بدهی', accParentCode: null, accType: 'credit', accCategory: 'liability', accSublevelFormat: 1 },
    { accCode: '03/001', accName: 'بدهی‌های جاری', accParentCode: '03', accType: 'credit', accCategory: 'liability', accSublevelFormat: 1 },
    { accCode: '03/001/001', accName: 'اسناد پرداختنی', accParentCode: '03/001', accType: 'credit', accCategory: 'liability', accSublevelFormat: 1 },
    { accCode: '03/001/001/001', accName: 'اسناد پرداختنی', accParentCode: '03/001/001', accType: 'credit', accCategory: 'liability', accSublevelFormat: 0 },
    { accCode: '03/001/002', accName: 'تسهیلات کوتاه مدت', accParentCode: '03/001', accType: 'credit', accCategory: 'liability', accSublevelFormat: 1 },
    { accCode: '03/001/002/001', accName: 'تسهیلات 1', accParentCode: '03/001/002', accType: 'credit', accCategory: 'liability', accSublevelFormat: 0 },
    { accCode: '03/002', accName: 'بدهی‌های بلند مدت', accParentCode: '03', accType: 'credit', accCategory: 'liability', accSublevelFormat: 1 },
    { accCode: '03/002/001', accName: 'تسهیلات بلندمدت', accParentCode: '03/002', accType: 'credit', accCategory: 'liability', accSublevelFormat: 1 },
    { accCode: '03/002/001/001', accName: 'وام 1', accParentCode: '03/002/001', accType: 'credit', accCategory: 'liability', accSublevelFormat: 0 },

    // فروش
    { accCode: '04', accName: 'فروش', accParentCode: null, accType: 'credit', accCategory: 'income', accSublevelFormat: 1 },
    { accCode: '04/001', accName: 'فروش خالص', accParentCode: '04', accType: 'credit', accCategory: 'income', accSublevelFormat: 1 },
    { accCode: '04/001/001', accName: 'فروش', accParentCode: '04/001', accType: 'credit', accCategory: 'income', accSublevelFormat: 0 },
    { accCode: '04/001/002', accName: 'تخفیف نقدی فروش', accParentCode: '04/001', accType: 'credit', accCategory: 'income', accSublevelFormat: 0 },
    { accCode: '04/002', accName: 'سایر درآمدهای فروش', accParentCode: '04', accType: 'credit', accCategory: 'income', accSublevelFormat: 0 },

    // خرید
    { accCode: '05', accName: 'خرید', accParentCode: null, accType: 'debit', accCategory: 'expense', accSublevelFormat: 1 },
    { accCode: '05/001', accName: 'خرید خالص', accParentCode: '05', accType: 'debit', accCategory: 'expense', accSublevelFormat: 1 },
    { accCode: '05/001/001', accName: 'خرید', accParentCode: '05/001', accType: 'debit', accCategory: 'expense', accSublevelFormat: 0 },
    { accCode: '05/001/002', accName: 'تخفیف نقدی خرید', accParentCode: '05/001', accType: 'debit', accCategory: 'expense', accSublevelFormat: 0 },
    { accCode: '05/002', accName: 'سایر هزینه‌های خرید', accParentCode: '05', accType: 'debit', accCategory: 'expense', accSublevelFormat: 0 },
    { accCode: '05/003', accName: 'موجودی اول دوره خالص', accParentCode: '05', accType: 'debit', accCategory: 'expense', accSublevelFormat: 1 },
    { accCode: '05/003/001', accName: 'موجودی اول دوره کالا', accParentCode: '05/003', accType: 'debit', accCategory: 'expense', accSublevelFormat: 0 },

    // هزینه
    { accCode: '06', accName: 'هزینه', accParentCode: null, accType: 'debit', accCategory: 'expense', accSublevelFormat: 1 },
    { accCode: '06/001', accName: 'هزینه‌های مالی', accParentCode: '06', accType: 'debit', accCategory: 'expense', accSublevelFormat: 0 },
    { accCode: '06/002', accName: 'هزینه مالیات', accParentCode: '06', accType: 'debit', accCategory: 'expense', accSublevelFormat: 0 },
    { accCode: '06/003', accName: 'هزینه کرایه حمل و بارگیری', accParentCode: '06', accType: 'debit', accCategory: 'expense', accSublevelFormat: 0 },
    { accCode: '06/004', accName: 'هزینه بازاریابی فروش', accParentCode: '06', accType: 'debit', accCategory: 'expense', accSublevelFormat: 0 },
    { accCode: '06/005', accName: 'هزینه‌های جاری', accParentCode: '06', accType: 'debit', accCategory: 'expense', accSublevelFormat: 0 },

    // درآمد
    { accCode: '07', accName: 'درآمد', accParentCode: null, accType: 'credit', accCategory: 'income', accSublevelFormat: 1 },
    { accCode: '07/001', accName: 'سایر درآمدها', accParentCode: '07', accType: 'credit', accCategory: 'income', accSublevelFormat: 0 },
    { accCode: '07/002', accName: 'درآمد اخذ مالیات', accParentCode: '07', accType: 'credit', accCategory: 'income', accSublevelFormat: 0 },

    // سرمایه
    { accCode: '08', accName: 'سرمایه', accParentCode: null, accType: 'credit', accCategory: 'equity', accSublevelFormat: 1 },
    { accCode: '08/001', accName: 'سرمایه', accParentCode: '08', accType: 'credit', accCategory: 'equity', accSublevelFormat: 0 },
    { accCode: '08/002', accName: 'سرمایه', accParentCode: '08', accType: 'credit', accCategory: 'equity', accSublevelFormat: 0 }
  ];

  for (const account of accounts) {
    await prisma.account.upsert({
      where: { accCode: account.accCode },
      update: account,
      create: account
    });
  }

  // ایجاد اشخاص اولیه
  console.log('👥 ایجاد اشخاص اولیه...');
  
  const persons = [
    {
      perCode: 'SabaAdmin',
      perName: 'مدیر',
      perLastName: 'سیستم', // نام خانوادگی جدید
      perNationalId: '0000000000',
      perMobile: '09132537217',
      perEmail: 'mahdizare.mz66@gmail.com',
      perTypeSet: 'customer,shareholder,vendor,lessor',
      perAccCode: null
    },
    {
      perCode: 'P001',
      perName: 'مدیر',
      perLastName: 'سیستم',
      perNationalId: '1234567890',
      perMobile: '09123456789',
      perEmail: 'admin@example.com',
      perTypeSet: 'customer,shareholder',
      perAccCode: '01/001/0001'
    },
    {
      perCode: 'P002',
      perName: 'کاربر',
      perLastName: 'نمونه',
      perNationalId: '0987654321',
      perMobile: '09987654321',
      perEmail: 'user@example.com',
      perTypeSet: 'customer',
      perAccCode: '01/001/0001'
    }
  ];

  for (const person of persons) {
    await prisma.person.upsert({
      where: { perCode: person.perCode },
      update: person,
      create: person
    });
  }

  // ایجاد حساب‌های کاربری
  console.log('🔐 ایجاد حساب‌های کاربری...');
  
  const hashedPassword = await bcrypt.hash('123456', 10);
  const hashedSabaPassword = await bcrypt.hash('Mahdi10Zare170', 10);
  
  const userAccounts = [
    {
      usrPerCode: 'SabaAdmin',
      usrUsername: 'SabaAdmin',
      usrPassword: hashedSabaPassword,
      usrRole: 'admin',
      usrAvatar: null // آواتار جدید
    },
    {
      usrPerCode: 'P001',
      usrUsername: 'admin',
      usrPassword: hashedPassword,
      usrRole: 'admin',
      usrAvatar: null
    },
    {
      usrPerCode: 'P002',
      usrUsername: 'user',
      usrPassword: hashedPassword,
      usrRole: 'viewer',
      usrAvatar: null
    }
  ];

  for (const userAccount of userAccounts) {
    await prisma.userAccount.upsert({
      where: { usrPerCode: userAccount.usrPerCode },
      update: userAccount,
      create: userAccount
    });
  }

  // ایجاد کیف پول‌ها
  console.log('💰 ایجاد کیف پول‌ها...');
  
  const wallets = [
    {
      wltPerCode: 'P001',
      wltBalance: 1000000,
      wltCreatedBy: 'system'
    },
    {
      wltPerCode: 'P002',
      wltBalance: 500000,
      wltCreatedBy: 'system'
    }
  ];

  for (const wallet of wallets) {
    await prisma.wallet.upsert({
      where: { wltPerCode: wallet.wltPerCode },
      update: wallet,
      create: wallet
    });
  }

  // ایجاد پروژه‌های نمونه
  console.log('🏗️ ایجاد پروژه‌های نمونه...');
  
  const projects = [
    {
      prjCode: 'PRJ001',
      prjTitle: 'ویلای کوهستانی',
      prjLocation: 'شمال کشور',
      prjType: 'custom',
      prjModel: 'shareholding',
      prjStartDate: new Date('2024-01-01'),
      prjEndDate: new Date('2030-12-31'),
      prjNav: 10000000,
      prjCreatedBy: 'system'
    },
    {
      prjCode: 'PRJ002',
      prjTitle: 'آپارتمان ساحلی',
      prjLocation: 'جنوب کشور',
      prjType: 'custom',
      prjModel: 'rental',
      prjStartDate: new Date('2024-06-01'),
      prjEndDate: new Date('2030-12-31'),
      prjNav: 5000000,
      prjCreatedBy: 'system'
    }
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { prjCode: project.prjCode },
      update: project,
      create: project
    });
  }

  // ایجاد واحدهای نمونه
  console.log('🏠 ایجاد واحدهای نمونه...');
  
  const units = [
    {
      untPrjCode: 'PRJ001',
      untCode: 'V001',
      untTitle: 'ویلای 2 خوابه',
      untType: 'villa',
      untArea: 150,
      untCapacity: 6,
      untFloor: '1',
      untBlock: 'A',
      untCreatedBy: 'system'
    },
    {
      untPrjCode: 'PRJ001',
      untCode: 'V002',
      untTitle: 'ویلای 3 خوابه',
      untType: 'villa',
      untArea: 200,
      untCapacity: 8,
      untFloor: '1',
      untBlock: 'B',
      untCreatedBy: 'system'
    },
    {
      untPrjCode: 'PRJ002',
      untCode: 'A001',
      untTitle: 'آپارتمان 1 خوابه',
      untType: 'apartment',
      untArea: 80,
      untCapacity: 4,
      untFloor: '1',
      untBlock: 'A',
      untCreatedBy: 'system'
    }
  ];

  for (const unit of units) {
    await prisma.unit.upsert({
      where: { 
        untPrjCode_untCode: {
          untPrjCode: unit.untPrjCode,
          untCode: unit.untCode
        }
      },
      update: unit,
      create: unit
    });
  }

  // ایجاد سهام‌داری
  console.log('📈 ایجاد سهام‌داری...');
  
  const shareholdings = [
    {
      shrPerCode: 'P001',
      shrPrjCode: 'PRJ001',
      shrShares: 100,
      shrUnitPrice: 100000,
      shrTotalValue: 10000000,
      shrFromDate: new Date('2024-01-01'),
      shrCreatedBy: 'system'
    },
    {
      shrPerCode: 'P002',
      shrPrjCode: 'PRJ001',
      shrShares: 50,
      shrUnitPrice: 100000,
      shrTotalValue: 5000000,
      shrFromDate: new Date('2024-02-01'),
      shrCreatedBy: 'system'
    }
  ];

  for (const shareholding of shareholdings) {
    await prisma.shareholding.upsert({
      where: { shrId: shareholding.shrId || 0 },
      update: shareholding,
      create: shareholding
    });
  }

  // ایجاد ویوها
  console.log('👁️ ایجاد ویوها...');
  
  const views = [
    // ویو تراز آزمایشی
    `CREATE OR REPLACE VIEW v_trial_balance AS
    SELECT 
      a.acc_code,
      a.acc_name,
      a.acc_type,
      a.acc_category,
      COALESCE(SUM(jd.jrd_debit), 0) as total_debit,
      COALESCE(SUM(jd.jrd_credit), 0) as total_credit,
      CASE 
        WHEN a.acc_type = 'debit' THEN COALESCE(SUM(jd.jrd_debit), 0) - COALESCE(SUM(jd.jrd_credit), 0)
        WHEN a.acc_type = 'credit' THEN COALESCE(SUM(jd.jrd_credit), 0) - COALESCE(SUM(jd.jrd_debit), 0)
        ELSE 0
      END as balance
    FROM t_account a
    LEFT JOIN t_journal_detail jd ON a.acc_code = jd.jrd_acc_code
    LEFT JOIN t_journal j ON jd.jrd_jrn_code = j.jrn_code
    WHERE a.acc_is_active = 1 AND (j.jrn_is_posted = 1 OR j.jrn_is_posted IS NULL)
    GROUP BY a.acc_code, a.acc_name, a.acc_type, a.acc_category
    ORDER BY a.acc_code`,

    // ویو دفتر کل
    `CREATE OR REPLACE VIEW v_general_ledger AS
    SELECT 
      j.jrn_date,
      j.jrn_code,
      j.jrn_desc,
      jd.jrd_line_no,
      jd.jrd_acc_code,
      a.acc_name as account_name,
      jd.jrd_debit,
      jd.jrd_credit,
      jd.jrd_desc as line_desc,
      j.jrn_module,
      j.jrn_ref_code
    FROM t_journal j
    JOIN t_journal_detail jd ON j.jrn_code = jd.jrd_jrn_code
    JOIN t_account a ON jd.jrd_acc_code = a.acc_code
    WHERE j.jrn_is_posted = 1
    ORDER BY j.jrn_date, j.jrn_code, jd.jrd_line_no`,

    // ویو کیف پول
    `CREATE OR REPLACE VIEW v_wallet_balance AS
    SELECT 
      w.wlt_per_code,
      p.per_name,
      w.wlt_balance,
      w.wlt_last_update,
      COALESCE(SUM(wt.wtx_amount), 0) as total_transactions
    FROM t_wallet w
    JOIN t_person p ON w.wlt_per_code = p.per_code
    LEFT JOIN t_wallet_transaction wt ON w.wlt_per_code = wt.wtx_per_code
    GROUP BY w.wlt_per_code, p.per_name, w.wlt_balance, w.wlt_last_update`,

    // ویو رزرو
    `CREATE OR REPLACE VIEW v_reservation_summary AS
    SELECT 
      r.res_id,
      r.res_prj_code,
      p.prj_title as project_title,
      r.res_unit_code,
      u.unt_title as unit_title,
      r.res_per_code,
      per.per_name as person_name,
      r.res_checkin,
      r.res_checkout,
      r.res_guest_count,
      r.res_total_price,
      r.res_status,
      DATEDIFF(r.res_checkout, r.res_checkin) as nights_count
    FROM t_reservation r
    JOIN t_project p ON r.res_prj_code = p.prj_code
    JOIN t_unit u ON r.res_prj_code = u.unt_prj_code AND r.res_unit_code = u.unt_code
    JOIN t_person per ON r.res_per_code = per.per_code
    ORDER BY r.res_checkin DESC`,

    // ویو سهام‌داری
    `CREATE OR REPLACE VIEW v_shareholding_summary AS
    SELECT 
      s.shr_id,
      s.shr_per_code,
      p.per_name as person_name,
      s.shr_prj_code,
      prj.prj_title as project_title,
      s.shr_shares,
      s.shr_unit_price,
      s.shr_total_value,
      s.shr_from_date,
      s.shr_to_date,
      s.shr_is_active
    FROM t_shareholding s
    JOIN t_person p ON s.shr_per_code = p.per_code
    JOIN t_project prj ON s.shr_prj_code = prj.prj_code
    ORDER BY s.shr_from_date DESC`,

    // ویو لاگ کاربران
    `CREATE OR REPLACE VIEW v_user_log_audit AS
    SELECT 
      ul.ulg_id,
      ul.ulg_per_code,
      p.per_name as person_name,
      ul.ulg_action,
      ul.ulg_table_name,
      ul.ulg_record_key,
      ul.ulg_desc,
      ul.ulg_timestamp,
      ul.ulg_ip_address
    FROM t_user_log ul
    JOIN t_person p ON ul.ulg_per_code = p.per_code
    ORDER BY ul.ulg_timestamp DESC`
  ];

  for (const view of views) {
    try {
      await prisma.$executeRawUnsafe(view);
      console.log('✅ ویو ایجاد شد');
    } catch (error) {
      console.log('⚠️ خطا در ایجاد ویو:', error.message);
    }
  }

  console.log('✅ داده‌های اولیه با موفقیت وارد شدند!');
  console.log('');
  console.log('🔑 اطلاعات ورود:');
  console.log('مدیر اصلی: SabaAdmin / Mahdi10Zare170');
  console.log('مدیر: admin / 123456');
  console.log('کاربر: user / 123456');
}

main()
  .catch((e) => {
    console.error('❌ خطا در وارد کردن داده‌ها:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 