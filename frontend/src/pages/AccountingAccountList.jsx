import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../theme';
import { Box, Typography, IconButton, Tooltip, Dialog, DialogContent, Button, TextField, FormControl, InputLabel, Select, MenuItem, Grid, FormControlLabel, Checkbox, Snackbar, Alert, Chip, Divider, FormHelperText, CircularProgress, useTheme } from '@mui/material';
import { AddCircle, Delete, Edit, Visibility, Refresh, CancelRounded, Print as PrintIcon, FileDownload as FileDownloadIcon, AccountBalance, ArrowDropDownRounded } from '@mui/icons-material';
import { MaterialReactTable } from 'material-react-table';
import { MRT_Localization_FA } from 'material-react-table/locales/fa';
import { getAllAccounts, createAccount, updateAccount, deleteAccount, getBankInfo, buildAccountTree, validateAccountCode, validateAccountName } from '../services/accountService';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { formatDateYMD } from '../utils/dateUtils';
import { useMessageHandler } from '../utils/messageHandler';

export default function AccountingAccountList() {
  const { t, i18n } = useTranslation();
  const { direction } = useAppTheme();
  const { getMessage, getErrorMessage } = useMessageHandler();
  const theme = useTheme();

  const accountTypes = [
    { value: 'debit', label: t('accounting.accountType.debit') },
    { value: 'credit', label: t('accounting.accountType.credit') },
    { value: 'neutral', label: t('accounting.accountType.neutral') }
  ];

  const accountCategories = [
    { value: 'asset', label: t('accounting.accountCategory.asset') },
    { value: 'liability', label: t('accounting.accountCategory.liability') },
    { value: 'equity', label: t('accounting.accountCategory.equity') },
    { value: 'income', label: t('accounting.accountCategory.income') },
    { value: 'expense', label: t('accounting.accountCategory.expense') }
  ];

  const currencies = [
    { value: 'IRR', label: t('accounting.currency.IRR') },
    { value: 'USD', label: t('accounting.currency.USD') },
    { value: 'EUR', label: t('accounting.currency.EUR') }
  ];

  // مقدار پیش‌فرض فرمت ساب‌لول برای حساب‌های ریشه
  const ROOT_SUBLEVEL_FORMAT = 2;

  const [tableData, setTableData] = useState([]);
  const [allAccounts, setAllAccounts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteAccounts, setDeleteAccounts] = useState([]);
  const [deleteResult, setDeleteResult] = useState(null);
  const tableContainerRef = useRef(null); // Ref for the table container

  const initialFormState = {
    accCode: '',
    accName: '',
    accParentCode: '',
    accSublevelFormat: 0,
    accType: '',
    accCategory: '',
    accIsBank: false,
    accIsActive: true,
    accNotes: '',
    accNumber: '',
  };

  const initialBankInfoState = {
    abkBankName: '',
    abkBranchName: '',
    abkAccountNo: '',
    abkSheba: '',
    abkCurrency: 'IRR',
    abkIsActive: true,
    abkIsPos: true,
    abkIsCheck: true
  };

  const initialErrorsState = {
    accCode: '',
    accName: '',
    accParentCode: '',
    accType: '',
    accCategory: '',
    accNumber: '',
  };

  const formReducer = (state, action) => {
    switch (action.type) {
      case 'SET_EDIT_ACCOUNT':
        return { ...state, ...action.payload };
      case 'RESET_FORM':
        return initialFormState;
      default:
        return state;
    }
  };

  const bankInfoReducer = (state, action) => {
    switch (action.type) {
      case 'SET_BANK_INFO':
        return { ...state, ...action.payload };
      case 'RESET_BANK_INFO':
        return initialBankInfoState;
      default:
        return state;
    }
  };

  const errorsReducer = (state, action) => {
    switch (action.type) {
      case 'SET_ERRORS':
        return { ...state, ...action.payload };
      case 'RESET_ERRORS':
        return initialErrorsState;
      default:
        return state;
    }
  };

  const [formState, dispatchForm] = React.useReducer(formReducer, initialFormState);
  const [bankInfoState, dispatchBankInfo] = React.useReducer(bankInfoReducer, initialBankInfoState);
  const [errorsState, dispatchErrors] = React.useReducer(errorsReducer, initialErrorsState);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await getAllAccounts();
      const accounts = response.data || [];
      setAllAccounts(accounts);

      // نمایش همه حساب‌های سطح اول (parent=null) و زیرشاخه‌هایشان
      const tree = buildAccountTree(accounts);
      setTableData(tree);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      const errorMessage = getErrorMessage(error);
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      accessorKey: 'accCode',
      header: t('accounting.accountCode'),
      size: 120
    },
    {
      accessorKey: 'accName',
      header: t('accounting.accountName'),
      size: 200
    },
    {
      accessorKey: 'accType',
      header: t('accounting.accountType'),
      size: 100,
      Cell: ({ cell }) => {
        const type = accountTypes.find(t => t.value === cell.getValue());
        return type ? type.label : cell.getValue();
      }
    },
    {
      accessorKey: 'accCategory',
      header: t('accounting.accountCategory'),
      size: 120,
      Cell: ({ cell }) => {
        const category = accountCategories.find(c => c.value === cell.getValue());
        return category ? category.label : cell.getValue();
      }
    },
    {
      accessorKey: 'accParentCode',
      header: t('accounting.parentAccount'),
      size: 100,
      Cell: ({ cell }) => cell.getValue() || '-'
    },
    {
      accessorKey: 'accIsActive',
      header: t('accounting.activeAccount'),
      size: 80,
      Cell: ({ cell }) => (
        <Chip
          label={cell.getValue() ? t('accounting.active') : t('accounting.inactive')}
          color={cell.getValue() ? 'success' : 'default'}

        />
      )
    },
    {
      accessorKey: 'accIsBank',
      header: t('accounting.bankAccount'),
      size: 80,
      Cell: ({ cell }) => cell.getValue() ? (
        <AccountBalance color="primary" />
      ) : '-'
    },
    {
      accessorKey: 'accCreatedAt',
      header: t('accounting.creationDate'),
      size: 120,
      Cell: ({ cell }) => formatDateYMD(cell.getValue(), i18n.language)
    }
  ];

  const printCleanTable = () => {
    // فقط ستون‌های داده‌ای (بدون چک‌باکس و عملیات)
    const dataColumns = columns.filter(
      col => col.accessorKey && col.header && col.header !== 'عملیات'
    );

    // ساخت هدر جدول
    const headerHtml = dataColumns
      .map(col => `<th>${col.header}</th>`)
      .join('');

    // ساخت بدنه جدول (درختی را به صورت تخت چاپ می‌کنیم)
    const flattenRows = (rows, level = 0) => {
      let result = [];
      for (const row of rows) {
        result.push({ ...row, _level: level });
        if (row.children && Array.isArray(row.children)) {
          result = result.concat(flattenRows(row.children, level + 1));
        }
      }
      return result;
    };
    const flatData = flattenRows(tableData);

    const bodyHtml = flatData
      .map((row, idx) =>
        `<tr style="background:${idx % 2 === 0 ? theme.palette.background.paper : theme.palette.action.hover};">` +
        dataColumns
          .map(col => {
            let value = row[col.accessorKey] ?? '';
            // نمایش چیپ فعال/غیرفعال
            if (col.accessorKey === 'accIsActive') {
              value = value ? t('accounting.active') : t('accounting.inactive');
            }
            // نمایش نوع حساب و دسته حساب با برچسب ترجمه
            if (col.accessorKey === 'accType') {
              const typeMap = {
                debit: t('accounting.accountType.debit'),
                credit: t('accounting.accountType.credit'),
                neutral: t('accounting.accountType.neutral')
              };
              value = typeMap[value] || value;
            }
            if (col.accessorKey === 'accCategory') {
              const catMap = {
                asset: t('accounting.accountCategory.asset'),
                liability: t('accounting.accountCategory.liability'),
                equity: t('accounting.accountCategory.equity'),
                income: t('accounting.accountCategory.income'),
                expense: t('accounting.accountCategory.expense')
              };
              value = catMap[value] || value;
            }
            // نمایش مقدار بله/خیر برای بانک
            if (col.accessorKey === 'accIsBank') {
              value = value ? t('accounting.yes') : t('accounting.no');
            }
            // نمایش تاریخ بر اساس زبان
            if (col.accessorKey === 'accCreatedAt' && value) {
              value = formatDateYMD(value, i18n.language);
            }
            // نمایش اینـدنت برای سطوح درختی
            if (col.accessorKey === 'accName' && row._level) {
              value = '&nbsp;'.repeat(row._level * 4) + value;
            }
            return `<td>${value}</td>`;
          })
          .join('') +
        '</tr>'
      )
      .join('');

    // تعیین جهت جدول و فونت بر اساس direction
    const printDirection = direction;
    const printTextAlign = printDirection === 'rtl' ? 'right' : 'left';
    const printFont = printDirection === 'rtl' ? 'IRANSansXFaNum' : 'IRANSansX';
    const printFontUrl = printDirection === 'rtl' ? '/fonts/IRANSansXFaNum-Regular.woff2' : '/fonts/IRANSansX-Regular.woff2';

    // ساخت HTML کامل
    const html = `
      <html>
        <head>
          <title>${t('accounting.accounts')}</title>
          <style>
            @font-face {
              font-family: '${printFont}';
              src: url('${printFontUrl}') format('woff2');
              font-weight: normal;
              font-style: normal;
            }
            body {
              font-family: '${printFont}', Tahoma, Arial, sans-serif !important;
              direction: ${printDirection};
              background: ${theme.palette.background.paper};
              margin: 0;
              padding: 16px;
              text-align: ${printTextAlign};
            }
            .print-title {
              text-align: center;
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 18px;
              color: ${theme.palette.text.primary};
            }
            table {
              border-collapse: collapse;
              width: 100%;
              font-size: 13px;
              background: ${theme.palette.background.paper};
              direction: ${printDirection};
              text-align: ${printTextAlign};
            }
            th, td {
              border: 1px solid ${theme.palette.border.medium};
              padding: 6px 10px;
              text-align: ${printTextAlign};
            }
            th {
              background: ${theme.palette.text.primary};
              color: ${theme.palette.background.paper};
              font-weight: bold;
            }
            tr:nth-child(even) {
              background: ${theme.palette.action.hover};
            }
            tr:nth-child(odd) {
              background: ${theme.palette.background.paper};
            }
            @media print {
              body { margin: 0; }
              th, td { font-size: 12px; }
            }
          </style>
        </head>
        <body>
          <div class="print-title">${t('accounting.accounts')}</div>
          <table>
            <thead>
              <tr>${headerHtml}</tr>
            </thead>
            <tbody>
              ${bodyHtml}
            </tbody>
          </table>
        </body>
      </html>
    `;

    // باز کردن پنجره چاپ
    const printWindow = window.open('', '', 'width=900,height=700');
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const exportToExcel = () => {
    const dataColumns = columns.filter(
      col => col.accessorKey && col.header && col.header !== 'عملیات'
    );

    const flattenRows = (rows, level = 0) => {
      let result = [];
      for (const row of rows) {
        result.push({ ...row, _level: level });
        if (row.children && Array.isArray(row.children)) {
          result = result.concat(flattenRows(row.children, level + 1));
        }
      }
      return result;
    };
    const flatData = flattenRows(tableData);

    const excelData = flatData.map(row => {
      const obj = {};
      dataColumns.forEach(col => {
        let value = row[col.accessorKey] ?? '';
        if (col.accessorKey === 'accIsActive') value = value ? t('accounting.active') : t('accounting.inactive');
        if (col.accessorKey === 'accType') {
          const typeMap = {
            debit: t('accounting.accountType.debit'),
            credit: t('accounting.accountType.credit'),
            neutral: t('accounting.accountType.neutral')
          };
          value = typeMap[value] || value;
        }
        if (col.accessorKey === 'accCategory') {
          const catMap = {
            asset: t('accounting.accountCategory.asset'),
            liability: t('accounting.accountCategory.liability'),
            equity: t('accounting.accountCategory.equity'),
            income: t('accounting.accountCategory.income'),
            expense: t('accounting.accountCategory.expense')
          };
          value = catMap[value] || value;
        }
        if (col.accessorKey === 'accIsBank') value = value ? t('accounting.yes') : t('accounting.no');
        if (col.accessorKey === 'accCreatedAt' && value) {
          value = formatDateYMD(value, i18n.language);
        }
        if (col.accessorKey === 'accName' && row._level) {
          value = ' '.repeat(row._level * 4) + value;
        }
        obj[col.header] = value;
      });
      return obj;
    });

    const title = t('accounting.accounts');
    const headerRow = dataColumns.map(col => col.header);
    const wsData = [[title], headerRow, ...excelData.map(row => headerRow.map(h => row[h]))];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = dataColumns.map(col => ({ wch: 18 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, t('accounting.accounts'));
    XLSX.writeFile(wb, 'accounts.xlsx');
  };

  const handleOpenModal = async (type, account = null) => {
    setModalType(type);
    dispatchErrors({ type: 'RESET_ERRORS' });

    if (type === 'create') {
      dispatchForm({ type: 'RESET_FORM' });
      dispatchBankInfo({ type: 'RESET_BANK_INFO' });
    } else {
      dispatchForm({ type: 'SET_EDIT_ACCOUNT', payload: account });

      // Load bank info if account is bank account
      if (account.accIsBank) {
        try {
          const bankResponse = await getBankInfo(account.accCode);
          if (bankResponse.data) {
            dispatchBankInfo({ type: 'SET_BANK_INFO', payload: bankResponse.data });
          }
        } catch (error) {
          console.error('Error loading bank info:', error);
          // Bank info might not exist yet, that's okay
        }
      } else {
        dispatchBankInfo({ type: 'RESET_BANK_INFO' });
      }
    }
    setSelectedAccount(account);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAccount(null);
    dispatchErrors({ type: 'RESET_ERRORS' });
  };

  const validateForm = () => {
    const newErrors = {};

    const codeError = validateAccountCode(formState.accCode);
    if (codeError) newErrors.accCode = codeError;

    const nameError = validateAccountName(formState.accName);
    if (nameError) newErrors.accName = nameError;

    if (!formState.accType) newErrors.accType = t('accounting.accountTypeRequired');
    if (!formState.accCategory) newErrors.accCategory = t('accounting.accountCategoryRequired');

    if (modalType === 'create') {
      if (!formState.accParentCode) newErrors.accParentCode = t('accounting.accountParentCodeRequired');
      if (!formState.accNumber) newErrors.accNumber = t('accounting.accountNumberRequired');
      if (!formState.accCode) newErrors.accCode = t('accounting.accountCodeRequired');
    }

    dispatchErrors({ type: 'SET_ERRORS', payload: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const accountData = {
        ...formState,
        bankInfo: formState.accIsBank ? bankInfoState : null
      };

      // پیام‌های دقیق برای هر عملیات:
      // ایجاد حساب
      if (modalType === 'create') {
        await createAccount(accountData);
        setSnackbar({ open: true, message: t('account.success.created'), severity: 'success' });
      }
      // ویرایش حساب
      else if (modalType === 'edit') {
        await updateAccount(formState.accCode, accountData);
        setSnackbar({ open: true, message: t('account.success.updated'), severity: 'success' });
      }

      setOpenModal(false);
      fetchAccounts(); // Refresh data
    } catch (error) {
      console.error('Error saving account:', error);
      const errorMessage = getErrorMessage(error);
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      if (modalType === 'delete') {
        // Bulk deletion
        const results = { deleted: [], failed: [] };

        for (const account of deleteAccounts) {
          try {
            await deleteAccount(account.accCode);
            results.deleted.push(account);
          } catch (error) {
            console.error(`Error deleting account ${account.accCode}:`, error);
            const errorCode = error.response?.data?.code;
            let reason = 'unknown';

            if (errorCode === 'ACC_005' || errorCode === 'CANNOT_DELETE_ACCOUNT_WITH_CHILDREN') {
              reason = 'hasChildren';
            } else if (errorCode === 'ACC_006' || errorCode === 'CANNOT_DELETE_ACCOUNT_WITH_TRANSACTIONS') {
              reason = 'usedInDocs';
            } else {
              reason = error.response?.data?.message || 'unknown';
            }

            results.failed.push({ ...account, reason });
          }
        }

        setDeleteResult(results);

        if (results.deleted.length > 0) {
          setSnackbar({
            open: true,
            message: t('accounting.bulkDeleteSuccess', { count: results.deleted.length }),
            severity: 'success'
          });
          fetchAccounts(); // Refresh data
        }

        if (results.failed.length > 0) {
          setSnackbar({
            open: true,
            message: t('accounting.bulkDeletePartial', {
              success: results.deleted.length,
              failed: results.failed.length
            }),
            severity: 'warning'
          });
        }
      } else {
        // Single deletion
        await deleteAccount(selectedAccount.accCode);
        setSnackbar({ open: true, message: t('account.success.deleted'), severity: 'success' });
        setOpenModal(false);
        fetchAccounts(); // Refresh data
      }
    } catch (error) {
      console.error('Error deleting account(s):', error);
      const errorMessage = getErrorMessage(error);
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Memoize parent account options for dropdown
  const parentAccountOptions = useMemo(() =>
    allAccounts
      .filter(acc => acc.accCode !== formState.accCode && acc.accSublevelFormat > 0)
      .map(acc => ({ value: acc.accCode, label: `${acc.accCode} - ${acc.accName}` })),
    [allAccounts, formState.accCode]
  );

  // تابع تولید کد حساب بر اساس والد و شماره حساب
  const generateAccountCode = (parentCode, number) => {
    let code = '';
    let paddedNumber = '';
    let sublevelFormat = 0;
    if (parentCode) {
      const parent = allAccounts.find(acc => acc.accCode === parentCode);
      sublevelFormat = parent ? parent.accSublevelFormat : ROOT_SUBLEVEL_FORMAT;
    } else {
      sublevelFormat = ROOT_SUBLEVEL_FORMAT;
    }
    if (number) {
      paddedNumber = String(number).padStart(sublevelFormat, '0');
      if (parentCode) {
        code = `${parentCode}/${paddedNumber}`;
      } else {
        code = paddedNumber;
      }
    } else {
      code = '';
    }
    return code;
  };

  // تابع مدیریت تغییرات ساب‌لول (و منطق بانک)
  const handleSublevelFormatChange = (val) => {
    let num = val === '' ? '' : Math.max(0, Math.min(6, Number(val)));
    dispatchForm({ type: 'SET_EDIT_ACCOUNT', payload: { accSublevelFormat: num } });
    if (num !== 0) {
      if (formState.accIsBank) {
        dispatchForm({ type: 'SET_EDIT_ACCOUNT', payload: { accIsBank: false } });
      }
      dispatchBankInfo({ type: 'RESET_BANK_INFO' });
    }
  };

  // 1. useMemo for accountNumberProps based on parent account
  const accountNumberProps = useMemo(() => {
    let maxLength = ROOT_SUBLEVEL_FORMAT;
    if (formState.accParentCode) {
      const parent = allAccounts.find(acc => acc.accCode === formState.accParentCode);
      maxLength = parent ? parent.accSublevelFormat : ROOT_SUBLEVEL_FORMAT;
    }
    return {
      maxLength,
      min: 0,
      max: Math.pow(10, maxLength) - 1
    };
  }, [formState.accParentCode, allAccounts]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0, m: 0, width: '100%', maxWidth: '100vw' }}>
      <MaterialReactTable
        columns={columns}
        data={tableData}
        enableStickyHeader
        enableStickyFooter
        enableRowSelection
        enableRowActions
        enableEditing
        enableExpanding
        enableGrouping
        enableTreeData
        enableColumnPinning
        enableColumnOrdering
        getTreeRowId={(row) => row.accCode}
        getSubRows={(row) => row.children}
        displayColumnDefOptions={{
          'mrt-row-select': { position: 'left', size: 40 },
          'mrt-row-actions': { position: 'left', size: 40 },
        }}
        localization={i18n.language === 'fa' ? MRT_Localization_FA : undefined}
        initialState={{
          columnPinning: {
            left: ['mrt-row-select', 'mrt-row-actions'],
          },
          showColumnFilters: false,
          showGlobalFilter: false,
          density: 'compact',
          expanded: true, // همه ردیف‌ها به صورت پیش‌فرض باز باشند
          pagination: { pageSize: 100 },
        }}
        muiTableContainerProps={{
          ref: tableContainerRef, // Pass ref to the table container
          sx: { maxHeight: 600 + 68, overflowY: 'auto' }
        }}
        muiTableFooterProps={{ sx: { height: 32, minHeight: 32, maxHeight: 32 } }}
        muiTableBodyRowProps={({ row }) => ({
          sx: {
            backgroundColor: row.index % 2 === 0 ? theme.palette.action.hover : 'transparent',
            // نمایش سطح درخت با indent
            paddingLeft: `${row.original._level ? row.original._level * 20 : 0}px`
          }
        })}
        // فقط همان ردیف انتخاب شود
        enableMultiRowSelection
        enableSelectAll={true}
        enableSubRowSelection={false}
        selectParentRowsOnChildSelect={false}
        renderTopToolbarCustomActions={({ table }) => {
          // فقط سطرهایی که کاربر مستقیماً انتخاب کرده (در هر سطح)
          const selectedRowIds = Object.keys(table.getState().rowSelection || {});
          const selectedRows = selectedRowIds
            .map(id => table.getRow(id))
            .filter(Boolean);
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Typography variant="h6" sx={{ ml: 2 }}>
                {t('accounting.accountList')}
              </Typography>
              <Tooltip title={t('accounting.refresh')}>
                <IconButton onClick={fetchAccounts} disabled={loading}>
                  <Refresh />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('accounting.createAccount')}>
                <IconButton color="success" onClick={() => handleOpenModal('create')}>
                  <AddCircle />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('accounting.deleteAccount')}>
                <Box component="span">
                  <IconButton
                    color="error"
                    disabled={selectedRows.length === 0}
                    onClick={() => {
                      setDeleteAccounts(selectedRows.map(row => ({ accCode: row.original.accCode, accName: row.original.accName })));
                      setModalType('delete');
                      setDeleteResult(null);
                      setOpenModal(true);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Tooltip>
              <Tooltip title={t('accounting.print')}>
                <IconButton onClick={printCleanTable}>
                  <PrintIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('accounting.exportToExcel')}>
                <IconButton onClick={exportToExcel}>
                  <FileDownloadIcon />
                </IconButton>
              </Tooltip>
            </Box>
          );
        }}
        renderRowActions={({ row }) => (
          <Box sx={{ display: 'flex', gap: 0.5, p: 0, m: 0, minWidth: 0 }}>
            <Tooltip title={t('accounting.viewAccount')}>
              <IconButton color="secondary" onClick={() => handleOpenModal('view', row.original)}>
                <Visibility />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('accounting.editAccount')}>
              <IconButton color="primary" onClick={() => handleOpenModal('edit', row.original)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('accounting.deleteAccount')}>
              <IconButton color="error" onClick={() => {
                setDeleteAccounts([{ accCode: row.original.accCode, accName: row.original.accName }]);
                setModalType('delete');
                setDeleteResult(null);
                setOpenModal(true);
              }}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        positionToolbarAlertBanner="none"
      />

      {/* مدال ایجاد/مشاهده/ویرایش/حذف حساب */}
      <Dialog open={openModal}
        maxWidth={formState.accIsBank ? 'md' : false}
        fullWidth={formState.accIsBank ? true : false}
        slotProps={{
          paper: {
            sx: {
              ...(formState.accIsBank ? {} : { maxWidth: 480, width: '100%' })
            }
          }
        }}>
        <Box>
          {/* دکمه بستن */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={handleCloseModal} color="error">
              <CancelRounded />
            </IconButton>
          </Box>
          {/* آیکون و عنوان */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {modalType === 'create' && <AddCircle color="success" />}
            {modalType === 'view' && <Visibility color="secondary" />}
            {modalType === 'edit' && <Edit color="info" />}
            {modalType === 'delete' && <Delete color="error" />}
            {modalType === 'create' && <Typography variant="h5" color="success">{t('accounting.createAccount')}</Typography>}
            {modalType === 'view' && <Typography variant="h5" color="secondary">{t('accounting.viewAccount')}</Typography>}
            {modalType === 'edit' && <Typography variant="h5" color="info">{t('accounting.editAccount')}</Typography>}
            {modalType === 'delete' && <Typography variant="h5" color="error">{t('accounting.deleteAccount')}</Typography>}
          </Box>
        </Box>
        <DialogContent sx={{ maxHeight: '70vh', overflowY: 'auto', p: { xs: 1.5, md: 3 } }}>
          {(modalType === 'create' || modalType === 'edit' || modalType === 'view') && (
            <Grid container spacing={2} columns={12}>
              {/* اطلاعات اصلی حساب */}
              <Grid size={{ xs: 12, md: formState.accIsBank ? 6 : 12 }}>
                <Divider sx={{ mb: 1.5, }}>{t('accounting.accountInfo')}</Divider>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FormControl fullWidth error={!!errorsState.accParentCode} sx={{ mb: 1 }}>
                    <InputLabel
                      sx={{

                      }}
                    >
                      {t('accounting.parentAccount')}
                    </InputLabel>
                    <Select
                      value={formState.accParentCode || ''}
                      label={t('accounting.parentAccount')}
                      onChange={e => {
                        const parentCode = e.target.value;
                        let accNumber = formState.accNumber;
                        const parent = allAccounts.find(acc => acc.accCode === parentCode);
                        const maxLength = parent ? parent.accSublevelFormat : ROOT_SUBLEVEL_FORMAT;
                        if (accNumber.length > maxLength) accNumber = accNumber.slice(-maxLength);
                        dispatchForm({ type: 'SET_EDIT_ACCOUNT', payload: { accParentCode: parentCode, accNumber } });
                        // تولید کد حساب
                        const code = generateAccountCode(parentCode, accNumber);
                        dispatchForm({ type: 'SET_EDIT_ACCOUNT', payload: { accCode: code } });
                      }}
                                            disabled={modalType === 'edit' || modalType === 'view'}
                      MenuProps={{
                        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                        transformOrigin: { vertical: 'top', horizontal: 'left' }
                      }}
                    >
                      <MenuItem value=""><em>{t('accounting.noParent')}</em></MenuItem>
                      {parentAccountOptions.map(opt => (
                        <MenuItem key={opt.value} value={opt.value} sx={{}}>{opt.label}</MenuItem>
                      ))}
                    </Select>
                    {errorsState.accParentCode && (
                      <FormHelperText error sx={{}}>{errorsState.accParentCode}</FormHelperText>
                    )}
                  </FormControl>
                </Box>
                {/* شماره حساب */}
                {modalType === 'create' && (
                  <TextField
                    fullWidth

                    margin="dense"
                    label={t('accounting.accountNumber')}
                    type="text"
                    value={formState.accNumber || ''}
                    onChange={e => {
                      let val = e.target.value.replace(/[^0-9]/g, '');
                      if (val.length > accountNumberProps.maxLength) val = val.slice(-accountNumberProps.maxLength);
                      dispatchForm({ type: 'SET_EDIT_ACCOUNT', payload: { accNumber: val } });
                      // تولید کد حساب
                      const code = generateAccountCode(formState.accParentCode, val);
                      dispatchForm({ type: 'SET_EDIT_ACCOUNT', payload: { accCode: code } });
                    }}
                    slotProps={{
                      input: {
                        ...accountNumberProps,
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        maxLength: accountNumberProps.maxLength,

                        placeholder: t('accounting.accountNumber')
                      }
                    }}
                    sx={{
                      '& .MuiInputLabel-root': {
                      }
                    }}
                  />
                )}
                <TextField
                  fullWidth

                  margin="dense"
                  label={t('accounting.accountCode')}
                  value={formState.accCode}
                  disabled
                  // همیشه غیرفعال
                  slotProps={{
                    input: {
                    }
                  }}
                  helperText={t('accounting.accountCodeAutoGenerated')}
                  sx={{
                    mb: 1,
                    '& .MuiInputBase-root': {

                      
                    },
                    '& .MuiInputLabel-root': {
                    }
                  }}
                />
                <TextField
                  fullWidth

                  margin="dense"
                  label={t('accounting.accountName')}
                  value={formState.accName}
                  disabled={modalType === 'view'}
                  onChange={e => dispatchForm({ type: 'SET_EDIT_ACCOUNT', payload: { accName: e.target.value } })}
                  error={!!errorsState.accName}
                  slotProps={{
                    input: {

                      placeholder: t('accounting.accountName')
                    }
                  }}
                  sx={{
                    mb: 1,
                    '& .MuiInputBase-root': {

                      
                    },
                    '& .MuiInputLabel-root': {
                    }
                  }}
                />
                {errorsState.accName && (
                  <FormHelperText error sx={{}}>{errorsState.accName}</FormHelperText>
                )}
                <FormControl fullWidth error={!!errorsState.accType} sx={{ mb: 1 }}>
                  <InputLabel>
                    {t('accounting.accountType')}
                  </InputLabel>
                  <Select
                    value={formState.accType || ''}
                    label={t('accounting.accountType')}
                    disabled={modalType === 'view'}
                    onChange={e => dispatchForm({ type: 'SET_EDIT_ACCOUNT', payload: { accType: e.target.value } })}
                  >
                    {accountTypes.map(opt => (
                      <MenuItem key={opt.value} value={opt.value} sx={{}}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                  {errorsState.accParentCode && (
                    <FormHelperText error sx={{}}>{errorsState.accParentCode}</FormHelperText>
                  )}
                </FormControl>
                <FormControl fullWidth error={!!errorsState.accCategory} sx={{ mb: 1 }}>
                  <InputLabel
                    sx={{
                    }}
                  >
                    {t('accounting.accountCategory')}
                  </InputLabel>
                  <Select
                    value={formState.accCategory}
                    label={t('accounting.accountCategory')}
                    disabled={modalType === 'view'}
                    onChange={e => dispatchForm({ type: 'SET_EDIT_ACCOUNT', payload: { accCategory: e.target.value } })}

                    MenuProps={{
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                      transformOrigin: { vertical: 'top', horizontal: 'right' }
                    }}
                    sx={{
                      textAlign: 'left',
                      '& .MuiInputBase-root': {
                        
                      },
                      '& .MuiInputLabel-root': {
                      }
                    }}
                  >
                    {accountCategories.map(category => (
                      <MenuItem key={category.value} value={category.value} sx={{}}>{category.label}</MenuItem>
                    ))}
                  </Select>
                  {errorsState.accCategory && (
                    <FormHelperText error sx={{}}>{errorsState.accCategory}</FormHelperText>
                  )}
                </FormControl>
                {/* ساب‌لول فقط عدد */}
                <TextField
                  fullWidth

                  margin="dense"
                  label={t('accounting.subLevelFormat')}
                  type="text"
                  value={formState.accSublevelFormat}
                  onChange={e => {
                    let val = e.target.value.replace(/[^0-9]/g, '');
                    handleSublevelFormatChange(val);
                  }}
                  slotProps={{
                    input: {
                      min: 0,
                      max: 6,
                      inputMode: 'numeric',
                      pattern: '[0-9]*',
                      maxLength: 1,
                    }
                  }}
                  helperText={t('accounting.subLevelFormatHelper')}
                  sx={{
                    mb: 1,
                    '& .MuiInputBase-root': {

                      
                    },
                    '& .MuiInputLabel-root': {
                    }
                  }}
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formState.accIsActive}
                        disabled={modalType === 'view'}
                        onChange={e => dispatchForm({ type: 'SET_EDIT_ACCOUNT', payload: { accIsActive: e.target.checked } })}
                        sx={{ p: 0.5 }}
                      />
                    }
                    label={<Typography sx={{}}>{t('accounting.activeAccount')}</Typography>}
                    sx={{ mt: 0.5, mr: 0 }}
                  />
                  {/* چک‌باکس حساب بانکی فقط اگر ساب‌لول صفر باشد */}
                  {formState.accSublevelFormat === 0 && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formState.accIsBank}
                          disabled={modalType === 'view'}
                          onChange={e => dispatchForm({ type: 'SET_EDIT_ACCOUNT', payload: { accIsBank: e.target.checked } })}
                          sx={{ p: 0.5 }}
                        />
                      }
                      label={<Typography sx={{}}>{t('accounting.bankAccount')}</Typography>}
                      sx={{ mt: 0.5, mr: 0 }}
                    />
                  )}
                </Box>
              </Grid>
              {/* اطلاعات حساب بانکی فقط اگر accIsBank و ساب‌لول صفر باشد */}
              {formState.accIsBank && formState.accSublevelFormat === 0 && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Divider sx={{ mb: 1.5, }}>{t('accounting.bankAccountInfo')}</Divider>
                  <TextField
                    fullWidth

                    margin="dense"
                    label={t('accounting.bankName')}
                    value={bankInfoState.abkBankName || ''}
                    disabled={modalType === 'view'}
                    onChange={e => dispatchBankInfo({ type: 'SET_BANK_INFO', payload: { abkBankName: e.target.value } })}
                    slotProps={{
                      input: {

                        placeholder: t('accounting.bankName')
                      }
                    }}
                    sx={{
                      mb: 1,
                      '& .MuiInputBase-root': {

                        
                      },
                      '& .MuiInputLabel-root': {
                      }
                    }}
                  />
                  <TextField
                    fullWidth

                    margin="dense"
                    label={t('accounting.branchName')}
                    value={bankInfoState.abkBranchName || ''}
                    disabled={modalType === 'view'}
                    onChange={e => dispatchBankInfo({ type: 'SET_BANK_INFO', payload: { abkBranchName: e.target.value } })}
                    slotProps={{
                      input: {

                        placeholder: t('accounting.branchName')
                      }
                    }}
                    sx={{
                      mb: 1,
                      '& .MuiInputBase-root': {

                        
                      },
                      '& .MuiInputLabel-root': {
                      }
                    }}
                  />
                  <TextField
                    fullWidth

                    margin="dense"
                    label={t('accounting.bankAccountNumber')}
                    value={bankInfoState.abkAccountNo || ''}
                    disabled={modalType === 'view'}
                    onChange={e => dispatchBankInfo({ type: 'SET_BANK_INFO', payload: { abkAccountNo: e.target.value } })}
                    slotProps={{
                      input: {

                        placeholder: t('accounting.bankAccountNumber')
                      }
                    }}
                    sx={{
                      mb: 1,
                      '& .MuiInputBase-root': {

                        
                      },
                      '& .MuiInputLabel-root': {
                      }
                    }}
                  />
                  <TextField
                    fullWidth

                    label={t('accounting.shebaNumber')}
                    value={bankInfoState.abkSheba || ''}
                    disabled={modalType === 'view'}
                    onChange={e => {
                      let val = e.target.value.replace(/[^0-9]/g, '');
                      dispatchBankInfo({ type: 'SET_BANK_INFO', payload: { abkSheba: val } });
                    }}
                    slotProps={{
                      input: {
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        maxLength: 24,

                        placeholder: t('accounting.shebaNumber')
                      }
                    }}
                    sx={{
                      mb: 1,
                      '& .MuiInputBase-root': {

                        
                      },
                      '& .MuiInputLabel-root': {
                      }
                    }}
                  />
                  <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel
                      sx={{
                      }}
                    >
                      {t('accounting.currency')}
                    </InputLabel>
                    <Select
                      value={bankInfoState.abkCurrency || 'IRR'}
                      label={t('accounting.currency')}
                      disabled={modalType === 'view'}
                      onChange={e => dispatchBankInfo({ type: 'SET_BANK_INFO', payload: { abkCurrency: e.target.value } })}

                      MenuProps={{
                        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                        transformOrigin: { vertical: 'top', horizontal: 'left' }
                      }}

                    >
                      {currencies.map(cur => (
                        <MenuItem key={cur.value} value={cur.value} sx={{}}>{cur.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={bankInfoState.abkIsActive}
                          disabled={modalType === 'view'}
                          onChange={e => dispatchBankInfo({ type: 'SET_BANK_INFO', payload: { abkIsActive: e.target.checked } })}
                          sx={{ p: 0.5 }}
                        />
                      }
                      label={<Typography sx={{}}>{t('accounting.bankAccountActive')}</Typography>}
                      sx={{ mt: 0.5, mr: 0 }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={bankInfoState.abkIsPos}
                          disabled={modalType === 'view'}
                          onChange={e => dispatchBankInfo({ type: 'SET_BANK_INFO', payload: { abkIsPos: e.target.checked } })}
                          sx={{ p: 0.5 }}
                        />
                      }
                      label={<Typography sx={{}}>{t('accounting.hasPosDevice')}</Typography>}
                      sx={{ mt: 0.5, mr: 0 }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={bankInfoState.abkIsCheck}
                          disabled={modalType === 'view'}
                          onChange={e => dispatchBankInfo({ type: 'SET_BANK_INFO', payload: { abkIsCheck: e.target.checked } })}
                          sx={{ p: 0.5 }}
                        />
                      }
                      label={<Typography sx={{}}>{t('accounting.hasCheckBook')}</Typography>}
                      sx={{ mt: 0.5, mr: 0 }}
                    />
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
          {modalType === 'delete' && (
            <Box>
              {!deleteResult && (
                <>
                  <Typography sx={{ mb: 1 }}>{t('accounting.confirmDelete')}</Typography>
                  <Box sx={{ maxHeight: 200, overflowY: 'auto', mb: 2 }}>
                    {deleteAccounts.map(acc => (
                      <Box key={acc.accCode} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography sx={{}}>{acc.accCode}</Typography>
                        <Typography color="text.secondary">{acc.accName}</Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
              {deleteResult && (
                <>
                  <Typography variant="h6" sx={{ mb: 2, }}>{t('accounting.deleteResult')}</Typography>
                  {deleteResult.deleted && deleteResult.deleted.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography color="success.main" sx={{ mb: 1 }}>{t('accounting.deletedAccounts')}:</Typography>
                      {deleteResult.deleted.map(acc => (
                        <Box key={acc.accCode} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography sx={{}}>{acc.accCode}</Typography>
                          <Typography color="text.secondary">{acc.accName}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                  {deleteResult.failed && deleteResult.failed.length > 0 && (
                    <Box>
                      <Typography color="error.main" sx={{ mb: 1 }}>{t('accounting.notDeletedAccounts')}:</Typography>
                      {deleteResult.failed.map(acc => (
                        <Box key={acc.accCode} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography sx={{}}>{acc.accCode}</Typography>
                          <Typography color="text.secondary">{acc.accName}</Typography>
                          <Typography color="error" sx={{}}>({acc.reason === 'hasChildren' ? t('accounting.hasChildren') : acc.reason === 'usedInDocs' ? t('accounting.usedInDocuments') : acc.reason})</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </>
              )}
            </Box>
          )}
          <Divider sx={{ my: 2 }} />
          {/* دکمه‌های پایین مدال */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
            {modalType === 'create' && (
              <>
                <Button onClick={handleSave} color="success" sx={{ minWidth: 90, py: 0.7 }} disabled={saving}>
                  {saving ? <CircularProgress size={18} /> : t('accounting.createAccount')}
                </Button>
                <Button onClick={handleCloseModal} color="inherit" sx={{ minWidth: 70, py: 0.7 }}>
                  {t('accounting.cancel')}
                </Button>
              </>
            )}
            {modalType === 'edit' && (
              <>
                <Button onClick={handleSave} color="info" sx={{ minWidth: 90, py: 0.7 }} disabled={saving}>
                  {saving ? <CircularProgress size={18} /> : t('accounting.saveChanges')}
                </Button>
                <Button onClick={handleCloseModal} color="inherit" sx={{ minWidth: 70, py: 0.7 }}>
                  {t('accounting.cancel')}
                </Button>
              </>
            )}
            {modalType === 'delete' && (
              <>
                {!deleteResult && (
                  <>
                    <Button onClick={handleDelete} color="error" sx={{ minWidth: 90, py: 0.7 }} disabled={saving}>
                      {saving ? <CircularProgress size={18} /> : t('accounting.deleteAccounts')}
                    </Button>
                    <Button onClick={handleCloseModal} color="inherit" sx={{ minWidth: 70, py: 0.7 }}>
                      {t('accounting.cancel')}
                    </Button>
                  </>
                )}
                {deleteResult && (
                  <Button onClick={handleCloseModal} color="primary" sx={{ minWidth: 90, py: 0.7 }}>
                    {t('accounting.close')}
                  </Button>
                )}
              </>
            )}
            {modalType === 'view' && (
              <Button onClick={handleCloseModal} color="secondary" sx={{ minWidth: 90, py: 0.7 }}>
                {t('accounting.cancel')}
              </Button>
            )}
          </Box>
          {errorsState.form && <Typography color="error" sx={{ mt: 1, textAlign: 'center', }}>{errorsState.form}</Typography>}
        </DialogContent>
      </Dialog>

      {/* پیام اسنک‌بار برای همه عملیات (در انتهای رندر صفحه) */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.severity === 'error' ? 5000 : 3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: '100%', alignItems: 'center' }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 
