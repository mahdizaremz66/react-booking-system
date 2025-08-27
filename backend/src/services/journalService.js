import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const saveJournal = async (journalData) => {
  const { jrnCode, details, ...headerData } = journalData;

  // تبدیل تاریخ به فرمت مناسب برای دیتابیس
  if (headerData.jrnDate) {
    headerData.jrnDate = new Date(headerData.jrnDate);
  }

  return prisma.$transaction(async (tx) => {
    let createdJournal;
    let newJrnCode;

    // اگر سند جدید است
    if (jrnCode === 'جدید' || jrnCode === 'new') {
      // تعیین سال مالی از تاریخ سند
      const fiscalYear = headerData.jrnDate.getFullYear();
      
      // پیدا کردن آخرین شماره سند در این سال مالی
      const lastJournal = await tx.journal.findFirst({
        where: {
          jrnCode: {
            startsWith: `${fiscalYear}.`
          }
        },
        orderBy: {
          jrnCode: 'desc'
        }
      });

      // ساخت کد سند جدید
      let sequenceNumber = 1;
      if (lastJournal) {
        const lastSequence = parseInt(lastJournal.jrnCode.split('.')[1], 10);
        sequenceNumber = lastSequence + 1;
      }
      
      // فرمت کد سند: YYYY.NNNNNN (مثال: 1402.000001)
      newJrnCode = `${fiscalYear}.${String(sequenceNumber).padStart(6, '0')}`;
      
      // ایجاد سند جدید
      createdJournal = await tx.journal.create({
        data: {
          ...headerData,
          jrnCode: newJrnCode
        },
      });
    } else {
      // اعتبارسنجی فرمت کد سند
      if (!/^\d{4}\.\d{6}$/.test(jrnCode)) {
        throw new Error('فرمت کد سند نامعتبر است. فرمت صحیح: YYYY.NNNNNN');
      }

      try {
        // حذف جزئیات سند قبلی
        await tx.journalDetail.deleteMany({
          where: { jrdJrnCode: jrnCode },
        });
        
        // حذف سند قبلی
        await tx.journal.delete({
          where: { jrnCode: jrnCode },
        });

        // ایجاد مجدد سند با همان کد
        createdJournal = await tx.journal.create({
          data: {
            ...headerData,
            jrnCode: jrnCode,
          },
        });
      } catch (error) {
        throw new Error('خطا در ویرایش سند: ' + error.message);
      }
    }

    // ایجاد جزئیات سند
    if (details && details.length > 0) {
      try {
        const detailsToCreate = details.map((detail, index) => ({
          jrdJrnCode: createdJournal.jrnCode,
          jrdLineNo: index + 1,
          jrdAccCode: detail.jrdAccCode,
          jrdDesc: detail.jrdDesc || null,
          jrdDebit: parseFloat(detail.jrdDebit) || 0,
          jrdCredit: parseFloat(detail.jrdCredit) || 0,
        }));

        await tx.journalDetail.createMany({
          data: detailsToCreate,
        });
      } catch (error) {
        throw new Error('خطا در ثبت جزئیات سند: ' + error.message);
      }
    }

    // برگرداندن اطلاعات کامل سند ایجاد شده
    const completeJournal = await tx.journal.findUnique({
      where: { jrnCode: createdJournal.jrnCode },
      include: {
        journalDetails: {
          orderBy: { jrdLineNo: 'asc' },
        },
      },
    });

    return completeJournal;
  });
};


// Journal CRUD
export const createJournal = async (data) => {
  return prisma.journal.create({ data });
};
export const getAllJournals = async () => {
  return prisma.journal.findMany();
};
export const getJournalById = async (jrnCode) => {
  // اعتبارسنجی فرمت کد سند
  if (!/^\d{4}\.\d{6}$/.test(jrnCode)) {
    throw new Error('فرمت کد سند نامعتبر است. فرمت صحیح: YYYY.NNNNNN');
  }
  return prisma.journal.findUnique({
    where: { jrnCode },
    include: {
      journalDetails: {
        orderBy: { jrdLineNo: 'asc' },
      },
    },
  });
};

// این تابع حذف شد چون نیازی به آن نیست
// export const updateJournal = async (jrnCode, data) => {
//   return prisma.journal.update({ where: { jrnCode }, data });
// };

export const deleteJournal = async (jrnCode) => {
  // اعتبارسنجی فرمت کد سند
  if (!/^\d{4}\.\d{6}$/.test(jrnCode)) {
    throw new Error('فرمت کد سند نامعتبر است. فرمت صحیح: YYYY.NNNNNN');
  }

  return prisma.$transaction(async (tx) => {
    // اول حذف جزئیات سند
    await tx.journalDetail.deleteMany({
      where: { jrdJrnCode: jrnCode },
    });
    // سپس حذف سند اصلی
    return tx.journal.delete({
      where: { jrnCode },
    });
  });
};

// JournalDetail CRUD
export const createJournalDetail = async (data) => {
  return prisma.journalDetail.create({ data });
};
export const getAllJournalDetails = async () => {
  return prisma.journalDetail.findMany();
};
export const getJournalDetailById = async (jrdJrnCode, jrdLineNo) => {
  return prisma.journalDetail.findUnique({ where: { jrdJrnCode_jrdLineNo: { jrdJrnCode, jrdLineNo } } });
};
export const updateJournalDetail = async (jrdJrnCode, jrdLineNo, data) => {
  return prisma.journalDetail.update({ where: { jrdJrnCode_jrdLineNo: { jrdJrnCode, jrdLineNo } }, data });
};
export const deleteJournalDetail = async (jrdJrnCode, jrdLineNo) => {
  return prisma.journalDetail.delete({ where: { jrdJrnCode_jrdLineNo: { jrdJrnCode, jrdLineNo } } });
}; 