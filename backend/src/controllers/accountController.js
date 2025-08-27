import { PrismaClient } from '@prisma/client';
import ResponseHandler from '../utils/responseHandler.js';

const prisma = new PrismaClient();

// Utility function to build account tree
function buildAccountTree(accounts) {
  const accountMap = new Map();
  
  // Create map of all accounts
  accounts.forEach(account => {
    accountMap.set(account.accCode, { ...account, children: [] });
  });

  // تابع بازگشتی برای ساخت درخت
  const buildTreeRecursive = (parentCode) => {
    // پیدا کردن همه حساب‌هایی که کد والدشان برابر parentCode است
    const children = accounts.filter(account => account.accParentCode === parentCode);
    
    return children.map(child => {
      const node = accountMap.get(child.accCode);
      
      // اگر accSublevelFormat > 0 باشد، یعنی این شاخه برگ نیست و می‌تواند فرزند داشته باشد
      if (child.accSublevelFormat > 0) {
        // بازگشتی فرزندان این حساب را پیدا کن
        node.children = buildTreeRecursive(child.accCode);
      }
      
      return node;
    });
  };

  // شروع از حساب‌هایی که کد والدشان 0 است
  const rootAccounts = buildTreeRecursive('0');
  
  return rootAccounts;
}

// Get all accounts
export const accGetAll = async (req, res) => {
  try {
    const accounts = await prisma.account.findMany({
      where: { accIsActive: true },
      orderBy: { accCode: 'asc' },
      include: {
        accountBanks: true
      }
    });

    ResponseHandler.success(res, 'ACCOUNTS_RETRIEVED', accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    ResponseHandler.internalError(res);
  }
};

// Get account by ID
export const accGetById = async (req, res) => {
  try {
    const { accCode } = req.params;

    const account = await prisma.account.findUnique({
      where: { accCode },
      include: {
        accountBanks: true
      }
    });

    if (!account) {
      return ResponseHandler.notFound(res, 'ACCOUNT_NOT_FOUND');
    }

    ResponseHandler.success(res, 'ACCOUNT_RETRIEVED', account);
  } catch (error) {
    console.error('Error fetching account:', error);
    ResponseHandler.internalError(res);
  }
};

// Create new account
export const accCreate = async (req, res) => {
  try {
    const {
      accCode,
      accName,
      accParentCode,
      accSublevelFormat,
      accType,
      accCategory,
      accIsBank,
      accIsActive,
      accNotes,
      bankInfo
    } = req.body;

    // Validate required fields
    if (!accCode || !accName || !accType || !accCategory) {
      return ResponseHandler.missingRequiredFields(res);
    }

    // Check if account code already exists
    const existingAccount = await prisma.account.findUnique({
      where: { accCode }
    });
    if (existingAccount) {
      return ResponseHandler.accountCodeExists(res);
    }

    // Validate parent account if provided
    if (accParentCode) {
      const parentAccount = await prisma.account.findUnique({
        where: { accCode: accParentCode }
      });
      if (!parentAccount) {
        return ResponseHandler.parentAccountNotFound(res);
      }
      // Prevent circular reference
      if (accParentCode === accCode) {
        return ResponseHandler.circularReference(res);
      }
    }

    // Create account
    const account = await prisma.account.create({
      data: {
        accCode,
        accName,
        accParentCode: accParentCode || null,
        accSublevelFormat: accSublevelFormat || 0,
        accType,
        accCategory,
        accIsBank: accIsBank || false,
        accIsActive: accIsActive !== undefined ? accIsActive : true,
        accNotes: accNotes || null,
        accCreatedBy: req.user?.perCode || 'system'
      }
    });

    // Create bank info if provided
    if (accIsBank && bankInfo) {
      await prisma.accountBank.create({
        data: {
          abkAccCode: accCode,
          abkBankName: bankInfo.abkBankName || null,
          abkBranchName: bankInfo.abkBranchName || null,
          abkAccountNo: bankInfo.abkAccountNo || null,
          abkSheba: bankInfo.abkSheba || null,
          abkCurrency: bankInfo.abkCurrency || 'IRR',
          abkIsActive: bankInfo.abkIsActive !== undefined ? bankInfo.abkIsActive : true,
          abkIsPos: bankInfo.abkIsPos !== undefined ? bankInfo.abkIsPos : true,
          abkIsCheck: bankInfo.abkIsCheck !== undefined ? bankInfo.abkIsCheck : true,
          abkCreatedBy: req.user?.perCode || 'system'
        }
      });
    }

    ResponseHandler.accountCreated(res, account);
  } catch (error) {
    // Handle Prisma unique constraint error
    if (error.code === 'P2002') {
      return ResponseHandler.accountCodeExists(res);
    }
    console.error('Error creating account:', error);
    ResponseHandler.internalError(res);
  }
};

// Update account
export const accUpdate = async (req, res) => {
  try {
    const { accCode } = req.params;
    const {
      accName,
      accParentCode,
      accSublevelFormat,
      accType,
      accCategory,
      accIsBank,
      accIsActive,
      accNotes,
      bankInfo
    } = req.body;

    // Check if account exists
    const existingAccount = await prisma.account.findUnique({
      where: { accCode }
    });
    if (!existingAccount) {
      return ResponseHandler.accountNotFound(res);
    }

    // Validate parent account if provided
    if (accParentCode && accParentCode !== existingAccount.accParentCode) {
      const parentAccount = await prisma.account.findUnique({
        where: { accCode: accParentCode }
      });
      if (!parentAccount) {
        return ResponseHandler.parentAccountNotFound(res);
      }
      // Prevent circular reference
      if (accParentCode === accCode) {
        return ResponseHandler.circularReference(res);
      }
    }

    // Update account
    const updatedAccount = await prisma.account.update({
      where: { accCode },
      data: {
        accName: accName || existingAccount.accName,
        accParentCode: accParentCode !== undefined ? (accParentCode || null) : existingAccount.accParentCode,
        accSublevelFormat: accSublevelFormat !== undefined ? accSublevelFormat : existingAccount.accSublevelFormat,
        accType: accType || existingAccount.accType,
        accCategory: accCategory || existingAccount.accCategory,
        accIsBank: accIsBank !== undefined ? accIsBank : existingAccount.accIsBank,
        accIsActive: accIsActive !== undefined ? accIsActive : existingAccount.accIsActive,
        accNotes: accNotes !== undefined ? accNotes : existingAccount.accNotes,
        accUpdatedBy: req.user?.perCode || 'system',
        accUpdatedAt: new Date()
      }
    });

    // Handle bank info
    if (accIsBank && bankInfo) {
      await prisma.accountBank.upsert({
        where: { abkAccCode: accCode },
        update: {
          abkBankName: bankInfo.abkBankName || null,
          abkBranchName: bankInfo.abkBranchName || null,
          abkAccountNo: bankInfo.abkAccountNo || null,
          abkSheba: bankInfo.abkSheba || null,
          abkCurrency: bankInfo.abkCurrency || 'IRR',
          abkIsActive: bankInfo.abkIsActive !== undefined ? bankInfo.abkIsActive : true,
          abkIsPos: bankInfo.abkIsPos !== undefined ? bankInfo.abkIsPos : true,
          abkIsCheck: bankInfo.abkIsCheck !== undefined ? bankInfo.abkIsCheck : true,
          abkUpdatedBy: req.user?.perCode || 'system',
          abkUpdatedAt: new Date()
        },
        create: {
          abkAccCode: accCode,
          abkBankName: bankInfo.abkBankName || null,
          abkBranchName: bankInfo.abkBranchName || null,
          abkAccountNo: bankInfo.abkAccountNo || null,
          abkSheba: bankInfo.abkSheba || null,
          abkCurrency: bankInfo.abkCurrency || 'IRR',
          abkIsActive: bankInfo.abkIsActive !== undefined ? bankInfo.abkIsActive : true,
          abkIsPos: bankInfo.abkIsPos !== undefined ? bankInfo.abkIsPos : true,
          abkIsCheck: bankInfo.abkIsCheck !== undefined ? bankInfo.abkIsCheck : true,
          abkCreatedBy: req.user?.perCode || 'system'
        }
      });
    } else if (!accIsBank) {
      // Remove bank info if account is no longer a bank account
      await prisma.accountBank.deleteMany({
        where: { abkAccCode: accCode }
      });
    }

    ResponseHandler.accountUpdated(res, updatedAccount);
  } catch (error) {
    console.error('Error updating account:', error);
    ResponseHandler.internalError(res);
  }
};

// Delete account
export const accDelete = async (req, res) => {
  try {
    const { accCode } = req.params;

    // Check if account exists
    const existingAccount = await prisma.account.findUnique({
      where: { accCode }
    });

    if (!existingAccount) {
      return ResponseHandler.accountNotFound(res);
    }

    // Check if account has children
    const children = await prisma.account.findMany({
      where: { accParentCode: accCode }
    });

    if (children.length > 0) {
      return ResponseHandler.cannotDeleteAccountWithChildren(res);
    }

    // Check if account is used in journal details
    const journalDetails = await prisma.journalDetail.findMany({
      where: { jrdAccCode: accCode }
    });

    if (journalDetails.length > 0) {
      return ResponseHandler.cannotDeleteAccountWithTransactions(res);
    }

    // Delete bank info first
    await prisma.accountBank.deleteMany({
      where: { abkAccCode: accCode }
    });

    // Delete account
    await prisma.account.delete({
      where: { accCode }
    });

    ResponseHandler.accountDeleted(res);
  } catch (error) {
    console.error('Error deleting account:', error);
    ResponseHandler.internalError(res);
  }
};

// Bulk delete accounts
export const accDeleteBulk = async (req, res) => {
  try {
    const { accCodes } = req.body;
    if (!Array.isArray(accCodes) || accCodes.length === 0) {
      return ResponseHandler.badRequest(res, 'NO_ACCOUNTS_SELECTED');
    }
    const deleted = [];
    const failed = [];
    for (const accCode of accCodes) {
      // Check if account exists
      const account = await prisma.account.findUnique({ where: { accCode } });
      if (!account) {
        failed.push({ accCode, accName: '', reason: 'notFound' });
        continue;
      }
      // Check for children
      const children = await prisma.account.findMany({ where: { accParentCode: accCode } });
      if (children.length > 0) {
        failed.push({ accCode, accName: account.accName, reason: 'hasChildren' });
        continue;
      }
      // Check for usage in journal details
      const used = await prisma.journalDetail.findFirst({ where: { jrdAccCode: accCode } });
      if (used) {
        failed.push({ accCode, accName: account.accName, reason: 'usedInDocs' });
        continue;
      }
      // Delete bank info
      await prisma.accountBank.deleteMany({ where: { abkAccCode: accCode } });
      // Delete account
      await prisma.account.delete({ where: { accCode } });
      deleted.push({ accCode, accName: account.accName });
    }
    return res.json({ deleted, failed });
  } catch (error) {
    console.error('Error in bulk account delete:', error);
    ResponseHandler.internalError(res);
  }
};

// Get account tree structure
export const accGetTree = async (req, res) => {
  try {
    const accounts = await prisma.account.findMany({
      where: { accIsActive: true },
      orderBy: { accCode: 'asc' },
      include: {
        accountBanks: true
      }
    });

    const tree = buildAccountTree(accounts);

    ResponseHandler.success(res, 'ACCOUNT_TREE_RETRIEVED', tree);
  } catch (error) {
    console.error('Error fetching account tree:', error);
    ResponseHandler.internalError(res);
  }
};

// Get children of an account
export const accGetChildren = async (req, res) => {
  try {
    const { accCode } = req.params;

    const children = await prisma.account.findMany({
      where: { 
        accParentCode: accCode,
        accIsActive: true 
      },
      orderBy: { accCode: 'asc' },
      include: {
        accountBanks: true
      }
    });

    ResponseHandler.success(res, 'ACCOUNT_CHILDREN_RETRIEVED', children);
  } catch (error) {
    console.error('Error fetching account children:', error);
    ResponseHandler.internalError(res);
  }
};

// Get bank info for an account
export const accGetBankInfo = async (req, res) => {
  try {
    const { accCode } = req.params;

    const bankInfo = await prisma.accountBank.findUnique({
      where: { abkAccCode: accCode }
    });

    if (!bankInfo) {
      return ResponseHandler.notFound(res, 'BANK_INFO_NOT_FOUND');
    }

    ResponseHandler.success(res, 'BANK_INFO_RETRIEVED', bankInfo);
  } catch (error) {
    console.error('Error fetching bank info:', error);
    ResponseHandler.internalError(res);
  }
};

// Save bank info
export const accSaveBankInfo = async (req, res) => {
  try {
    const { accCode } = req.params;
    const bankInfo = req.body;

    // Check if account exists and is a bank account
    const account = await prisma.account.findUnique({
      where: { accCode }
    });

    if (!account) {
      return ResponseHandler.notFound(res, 'ACCOUNT_NOT_FOUND');
    }

    if (!account.accIsBank) {
      return ResponseHandler.badRequest(res, 'ACCOUNT_IS_NOT_BANK_ACCOUNT');
    }

    const savedBankInfo = await prisma.accountBank.create({
      data: {
        abkAccCode: accCode,
        abkBankName: bankInfo.abkBankName || null,
        abkBranchName: bankInfo.abkBranchName || null,
        abkAccountNo: bankInfo.abkAccountNo || null,
        abkSheba: bankInfo.abkSheba || null,
        abkCurrency: bankInfo.abkCurrency || 'IRR',
        abkIsActive: bankInfo.abkIsActive !== undefined ? bankInfo.abkIsActive : true,
        abkIsPos: bankInfo.abkIsPos !== undefined ? bankInfo.abkIsPos : true,
        abkIsCheck: bankInfo.abkIsCheck !== undefined ? bankInfo.abkIsCheck : true,
        abkCreatedBy: req.user?.perCode || 'system'
      }
    });

    ResponseHandler.success(res, 'BANK_INFO_SAVED', savedBankInfo);
  } catch (error) {
    console.error('Error saving bank info:', error);
    ResponseHandler.internalError(res);
  }
};

// Update bank info
export const accUpdateBankInfo = async (req, res) => {
  try {
    const { accCode } = req.params;
    const bankInfo = req.body;

    const updatedBankInfo = await prisma.accountBank.update({
      where: { abkAccCode: accCode },
      data: {
        abkBankName: bankInfo.abkBankName || null,
        abkBranchName: bankInfo.abkBranchName || null,
        abkAccountNo: bankInfo.abkAccountNo || null,
        abkSheba: bankInfo.abkSheba || null,
        abkCurrency: bankInfo.abkCurrency || 'IRR',
        abkIsActive: bankInfo.abkIsActive !== undefined ? bankInfo.abkIsActive : true,
        abkIsPos: bankInfo.abkIsPos !== undefined ? bankInfo.abkIsPos : true,
        abkIsCheck: bankInfo.abkIsCheck !== undefined ? bankInfo.abkIsCheck : true,
        abkUpdatedBy: req.user?.perCode || 'system',
        abkUpdatedAt: new Date()
      }
    });

    ResponseHandler.success(res, 'BANK_INFO_UPDATED', updatedBankInfo);
  } catch (error) {
    console.error('Error updating bank info:', error);
    ResponseHandler.internalError(res);
  }
};

// Delete bank info
export const accDeleteBankInfo = async (req, res) => {
  try {
    const { accCode } = req.params;

    await prisma.accountBank.delete({
      where: { abkAccCode: accCode }
    });

    ResponseHandler.success(res, 'BANK_INFO_DELETED');
  } catch (error) {
    console.error('Error deleting bank info:', error);
    ResponseHandler.internalError(res);
  }
};

// Get account statistics
export const accGetStats = async (req, res) => {
  try {
    const totalAccounts = await prisma.account.count({
      where: { accIsActive: true }
    });

    const activeAccounts = await prisma.account.count({
      where: { accIsActive: true }
    });

    const bankAccounts = await prisma.account.count({
      where: { 
        accIsActive: true,
        accIsBank: true 
      }
    });

    const accountsByCategory = await prisma.account.groupBy({
      by: ['accCategory'],
      where: { accIsActive: true },
      _count: {
        accCode: true
      }
    });

    const accountsByType = await prisma.account.groupBy({
      by: ['accType'],
      where: { accIsActive: true },
      _count: {
        accCode: true
      }
    });

    const stats = {
      totalAccounts,
      activeAccounts,
      bankAccounts,
      accountsByCategory,
      accountsByType
    };

    ResponseHandler.success(res, 'ACCOUNT_STATS_RETRIEVED', stats);
  } catch (error) {
    console.error('Error fetching account stats:', error);
    ResponseHandler.internalError(res);
  }
};

// Get accounts by category
export const accGetByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const accounts = await prisma.account.findMany({
      where: { 
        accCategory: category,
        accIsActive: true 
      },
      orderBy: { accCode: 'asc' },
      include: {
        accountBanks: true
      }
    });

    ResponseHandler.success(res, 'ACCOUNTS_BY_CATEGORY_RETRIEVED', accounts);
  } catch (error) {
    console.error('Error fetching accounts by category:', error);
    ResponseHandler.internalError(res);
  }
};

// Get accounts by type
export const accGetByType = async (req, res) => {
  try {
    const { type } = req.params;

    const accounts = await prisma.account.findMany({
      where: { 
        accType: type,
        accIsActive: true 
      },
      orderBy: { accCode: 'asc' },
      include: {
        accountBanks: true
      }
    });

    ResponseHandler.success(res, 'ACCOUNTS_BY_TYPE_RETRIEVED', accounts);
  } catch (error) {
    console.error('Error fetching accounts by type:', error);
    ResponseHandler.internalError(res);
  }
}; 