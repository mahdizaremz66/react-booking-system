import api from './api';

// Base API endpoints
const ACCOUNT_BASE_URL = '/accounts';

// Account CRUD operations
export const getAllAccounts = async () => {
  try {
    const response = await api.get(`${ACCOUNT_BASE_URL}/accGetAll`);
    return response.data;
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
};

export const getAccountById = async (accCode) => {
  try {
    // URL encode the account code to handle forward slashes properly
    const encodedAccCode = encodeURIComponent(accCode);
    const response = await api.get(`${ACCOUNT_BASE_URL}/accGetById/${encodedAccCode}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching account by ID:', error);
    throw error;
  }
};

export const createAccount = async (accountData) => {
  try {
    const response = await api.post(`${ACCOUNT_BASE_URL}/accCreate`, accountData);
    return response.data;
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
};

export const updateAccount = async (accCode, accountData) => {
  try {
    // URL encode the account code to handle forward slashes properly
    const encodedAccCode = encodeURIComponent(accCode);
    const response = await api.put(`${ACCOUNT_BASE_URL}/accUpdate/${encodedAccCode}`, accountData);
    return response.data;
  } catch (error) {
    console.error('Error updating account:', error);
    throw error;
  }
};

export const deleteAccount = async (accCode) => {
  try {
    // URL encode the account code to handle forward slashes properly
    const encodedAccCode = encodeURIComponent(accCode);
    const response = await api.delete(`${ACCOUNT_BASE_URL}/accDelete/${encodedAccCode}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};

// Account tree structure
export const getAccountTree = async () => {
  try {
    const response = await api.get(`${ACCOUNT_BASE_URL}/accGetTree`);
    return response.data;
  } catch (error) {
    console.error('Error fetching account tree:', error);
    throw error;
  }
};

export const getAccountChildren = async (accCode) => {
  try {
    // URL encode the account code to handle forward slashes properly
    const encodedAccCode = encodeURIComponent(accCode);
    const response = await api.get(`${ACCOUNT_BASE_URL}/accGetChildren/${encodedAccCode}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching account children:', error);
    throw error;
  }
};

// Bank account operations
export const getBankInfo = async (accCode) => {
  try {
    // URL encode the account code to handle forward slashes properly
    const encodedAccCode = encodeURIComponent(accCode);
    const response = await api.get(`${ACCOUNT_BASE_URL}/accGetBankInfo/${encodedAccCode}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bank info:', error);
    throw error;
  }
};

export const saveBankInfo = async (accCode, bankInfo) => {
  try {
    // URL encode the account code to handle forward slashes properly
    const encodedAccCode = encodeURIComponent(accCode);
    const response = await api.post(`${ACCOUNT_BASE_URL}/accSaveBankInfo/${encodedAccCode}`, bankInfo);
    return response.data;
  } catch (error) {
    console.error('Error saving bank info:', error);
    throw error;
  }
};

export const updateBankInfo = async (accCode, bankInfo) => {
  try {
    // URL encode the account code to handle forward slashes properly
    const encodedAccCode = encodeURIComponent(accCode);
    const response = await api.put(`${ACCOUNT_BASE_URL}/accUpdateBankInfo/${encodedAccCode}`, bankInfo);
    return response.data;
  } catch (error) {
    console.error('Error updating bank info:', error);
    throw error;
  }
};

export const deleteBankInfo = async (accCode) => {
  try {
    // URL encode the account code to handle forward slashes properly
    const encodedAccCode = encodeURIComponent(accCode);
    const response = await api.delete(`${ACCOUNT_BASE_URL}/accDeleteBankInfo/${encodedAccCode}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting bank info:', error);
    throw error;
  }
};

// Account statistics and reports
export const getAccountStats = async () => {
  try {
    const response = await api.get(`${ACCOUNT_BASE_URL}/accGetStats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching account stats:', error);
    throw error;
  }
};

export const getAccountsByCategory = async (category) => {
  try {
    const response = await api.get(`${ACCOUNT_BASE_URL}/accGetByCategory/${category}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching accounts by category:', error);
    throw error;
  }
};

export const getAccountsByType = async (type) => {
  try {
    const response = await api.get(`${ACCOUNT_BASE_URL}/accGetByType/${type}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching accounts by type:', error);
    throw error;
  }
};

// Utility functions for frontend
export const buildAccountTree = (accounts) => {
  // Map for quick lookup
  const accountMap = new Map();
  accounts.forEach(account => {
    accountMap.set(account.accCode, { ...account, children: [] });
  });

  // Set to track which nodes have been added to the tree
  const added = new Set();

  // Recursive function to build children
  function buildNode(node) {
    if (added.has(node.accCode)) return null; // Prevent duplicate
    added.add(node.accCode);
    const children = accounts
      .filter(acc => acc.accParentCode === node.accCode)
      .map(acc => buildNode(accountMap.get(acc.accCode)))
      .filter(Boolean);
    return { ...node, children };
  }

  // Start from root nodes (accParentCode == null)
  return accounts
    .filter(acc => acc.accParentCode == null)
    .map(acc => buildNode(accountMap.get(acc.accCode)))
    .filter(Boolean);
};

export const flattenAccountTree = (tree, level = 0) => {
  let result = [];
  tree.forEach(node => {
    result.push({
      ...node,
      _level: level,
      _hasChildren: node.children.length > 0,
      _isExpanded: false
    });
    if (node.children.length > 0) {
      result = result.concat(flattenAccountTree(node.children, level + 1));
    }
  });
  return result;
};

// Validation functions
export const validateAccountCode = (accCode) => {
  if (!accCode) return 'کد حساب الزامی است';
  if (accCode.length < 2) return 'کد حساب باید حداقل 2 کاراکتر باشد';
  if (!/^[0-9\/]+$/.test(accCode)) return 'کد حساب فقط باید شامل اعداد و / باشد';
  return null;
};

export const validateAccountName = (accName) => {
  if (!accName) return 'نام حساب الزامی است';
  if (accName.length < 3) return 'نام حساب باید حداقل 3 کاراکتر باشد';
  return null;
};

export const validateParentAccount = (accParentCode, accCode) => {
  if (accParentCode === accCode) return 'حساب نمی‌تواند والد خودش باشد';
  return null;
};

// Error message mapping
export const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'MISSING_REQUIRED_FIELDS': 'فیلدهای الزامی را پر کنید',
    'ACCOUNT_CODE_ALREADY_EXISTS': 'کد حساب قبلاً وجود دارد',
    'PARENT_ACCOUNT_NOT_FOUND': 'حساب والد یافت نشد',
    'ACCOUNT_NOT_FOUND': 'حساب یافت نشد',
    'CIRCULAR_REFERENCE_NOT_ALLOWED': 'ارجاع دایره‌ای مجاز نیست',
    'CANNOT_DELETE_ACCOUNT_WITH_CHILDREN': 'نمی‌توان حساب دارای زیرمجموعه را حذف کرد',
    'CANNOT_DELETE_ACCOUNT_WITH_TRANSACTIONS': 'نمی‌توان حساب دارای تراکنش را حذف کرد',
    'BANK_INFO_NOT_FOUND': 'اطلاعات بانکی یافت نشد',
    'ACCOUNT_IS_NOT_BANK_ACCOUNT': 'این حساب بانکی نیست'
  };
  
  return errorMessages[errorCode] || 'خطای نامشخص';
}; 