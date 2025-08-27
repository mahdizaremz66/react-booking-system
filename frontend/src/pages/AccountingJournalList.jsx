import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../theme';
import { Box, Typography, IconButton, Tooltip, TextField, Grid, Snackbar, Alert, Chip, Divider, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Menu, ListItemIcon, ListItemText, ListItemButton, useTheme, Button } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { AddCircle, Delete, Refresh, Print as PrintIcon, FileDownload as FileDownloadIcon, Save, KeyboardArrowUp, KeyboardArrowDown, ArrowDropDownRounded, AttachFile, KeyboardDoubleArrowLeft, KeyboardArrowLeft, KeyboardArrowRight, KeyboardDoubleArrowRight, LibraryAddTwoTone, AddBoxTwoTone, DisabledByDefaultTwoTone } from '@mui/icons-material';
import { getJournals, createJournal, updateJournal, deleteJournal, getJournal } from '../services/journalService';
import { getAllAccounts } from '../services/accountService';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { formatDateYMD } from '../utils/dateUtils';
import { useMessageHandler } from '../utils/messageHandler';
import AppDatePicker from '../components/AppDatePicker';

export default function AccountingJournalList() {
  const { t } = useTranslation();
  const { getMessage, getErrorMessage } = useMessageHandler();
  const theme = useTheme();

  const [tableData, setTableData] = useState([]);
  const [allAccounts, setAllAccounts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteJournals, setDeleteJournals] = useState([]);
  const [deleteResult, setDeleteResult] = useState(null);
  const [currentJournalIndex, setCurrentJournalIndex] = useState(0);
  const [totalJournals, setTotalJournals] = useState(0);
  const [isDocumentEditable, setIsDocumentEditable] = useState(false);
  const [contextMenuAnchor, setContextMenuAnchor] = useState(null);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [accountTreeOpen, setAccountTreeOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [accountFilter, setAccountFilter] = useState('');
  const [accountTreeAnchor, setAccountTreeAnchor] = useState(null);
  const tableContainerRef = useRef(null);

  // Document form state
  const initialDocumentState = {
    jrnCode: 'new',
    jrnDate: new Date(),
    jrnDesc: '',
    jrnType: 'manual',
    jrnModule: '',
    jrnRefCode: '',
    jrnIsPosted: false,
    jrnCreatedBy: '',
    details: []
  };

  const initialDetailState = {
    jrdAccCode: '',
    jrdDebit: 0,
    jrdCredit: 0,
    jrdDesc: ''
  };

  const initialErrorsState = {
    jrnDate: '',
    jrnDesc: '',
    details: []
  };

  const [documentState, setDocumentState] = useState(initialDocumentState);
  const [errorsState, setErrorsState] = useState(initialErrorsState);

  const navigate = useNavigate();

  useEffect(() => {
    fetchJournals();
    fetchAccounts();
  }, []);

  const fetchJournals = async () => {
    setLoading(true);
    try {
      const response = await getJournals();
      const journals = response.data || [];
      setTableData(journals);
      setTotalJournals(journals.length);
    } catch (error) {
      console.error('Error fetching journals:', error);
      setSnackbar({
        open: true,
        message: getErrorMessage(error),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await getAllAccounts();
      const accounts = response.data || [];
      setAllAccounts(accounts);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setSnackbar({
        open: true,
        message: getErrorMessage(error),
        severity: 'error'
      });
    }
  };

  const handleOpenModal = async (type, journal = null) => {
    setModalType(type);
    setErrorsState(initialErrorsState);

    if (type === 'create') {
      setDocumentState(initialDocumentState);
      setIsDocumentEditable(true);
    } else if (type === 'edit' && journal) {
      try {
        const response = await getJournal(journal.jrnCode);
        const journalData = response.data;
        setDocumentState({
          ...journalData,
          jrnDate: new Date(journalData.jrnDate)
        });
        setIsDocumentEditable(true);
      } catch (error) {
        console.error('Error fetching journal details:', error);
        setSnackbar({
          open: true,
          message: getErrorMessage(error),
          severity: 'error'
        });
        return;
      }
    } else if (type === 'view' && journal) {
      try {
        const response = await getJournal(journal.jrnCode);
        const journalData = response.data;
        setDocumentState({
          ...journalData,
          jrnDate: new Date(journalData.jrnDate)
        });
        setIsDocumentEditable(false);
      } catch (error) {
        console.error('Error fetching journal details:', error);
        setSnackbar({
          open: true,
          message: getErrorMessage(error),
          severity: 'error'
        });
        return;
      }
    }

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setDocumentState(initialDocumentState);
    setErrorsState(initialErrorsState);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const journalData = {
        ...documentState,
        jrnDate: formatDateYMD(documentState.jrnDate)
      };

      let response;
      if (modalType === 'create') {
        response = await createJournal(journalData);
      } else {
        response = await updateJournal(documentState.jrnCode, journalData);
      }

      if (response.success) {
        setSnackbar({
          open: true,
          message: getMessage(response.message),
          severity: 'success'
        });
        handleCloseModal();
      fetchJournals();
      } else {
        setSnackbar({
          open: true,
          message: getErrorMessage(response.error),
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error saving journal:', error);
      setSnackbar({
        open: true,
        message: getErrorMessage(error),
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const validateForm = () => {
    const errors = { ...initialErrorsState };
    let isValid = true;

    if (!documentState.jrnDate) {
      errors.jrnDate = t('validation.required', { field: t('journal.date') });
      isValid = false;
    }

    if (!documentState.jrnDesc?.trim()) {
      errors.jrnDesc = t('validation.required', { field: t('journal.description') });
      isValid = false;
    }

    if (documentState.details.length === 0) {
      errors.details = t('validation.atLeastOneDetail');
      isValid = false;
    }

    const detailErrors = [];
    documentState.details.forEach((detail, index) => {
      const detailError = {};
      if (!detail.jrdAccCode) {
        detailError.jrdAccCode = t('validation.required', { field: t('journal.account') });
      isValid = false;
    }
      if (detail.jrdDebit === 0 && detail.jrdCredit === 0) {
        detailError.amount = t('validation.amountRequired');
        isValid = false;
      }
      if (detail.jrdDebit > 0 && detail.jrdCredit > 0) {
        detailError.amount = t('validation.onlyOneAmount');
        isValid = false;
      }
      detailErrors.push(detailError);
    });

    errors.details = detailErrors;
    setErrorsState(errors);
    return isValid;
  };

  const addDetailRow = (position = 'end', copyIndex = null) => {
    const newDetail = copyIndex !== null 
      ? { ...documentState.details[copyIndex] }
      : { ...initialDetailState };

    const newDetails = [...documentState.details];
    if (position === 'end') {
      newDetails.push(newDetail);
    } else {
      newDetails.splice(position, 0, newDetail);
    }

    setDocumentState(prev => ({
      ...prev,
      details: newDetails
    }));
  };

  const removeDetailRow = (index) => {
    const newDetails = documentState.details.filter((_, i) => i !== index);
    setDocumentState(prev => ({
      ...prev,
      details: newDetails
    }));
  };

  const updateDetail = (index, field, value) => {
    const newDetails = [...documentState.details];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setDocumentState(prev => ({
      ...prev,
      details: newDetails
    }));
  };

  const buildAccountTree = () => {
    const accountMap = new Map();
    const rootAccounts = [];

    allAccounts.forEach(account => {
      accountMap.set(account.accCode, { ...account, children: [] });
    });

    allAccounts.forEach(account => {
      if (account.accParentCode && accountMap.has(account.accParentCode)) {
        accountMap.get(account.accParentCode).children.push(accountMap.get(account.accCode));
      } else {
        rootAccounts.push(accountMap.get(account.accCode));
      }
    });

    const renderAccountItem = (account, level = 0) => {
      const getLevelColor = (level) => {
        const colors = [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.success.main,
          theme.palette.info.main,
          theme.palette.warning.main
        ];
        return colors[level % colors.length];
      };

        return (
          <TreeItem
            key={account.accCode}
          nodeId={account.accCode}
            label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography 
                sx={{ 
                  color: theme.palette.text.primary,
                }}
              >
                {account.accCode} - {account.accName}
              </Typography>
              <Chip 
                label={account.accType} 
                sx={{ 
                  backgroundColor: getLevelColor(level),
                  color: theme.palette.common.white
                }}
              />
              </Box>
            }
          >
          {account.children.map(child => renderAccountItem(child, level + 1))}
          </TreeItem>
        );
    };

    return rootAccounts.map(account => renderAccountItem(account));
  };

  const moveDetailRow = (index, direction) => {
    if (direction === 'up' && index > 0) {
      const newDetails = [...documentState.details];
      [newDetails[index], newDetails[index - 1]] = [newDetails[index - 1], newDetails[index]];
      setDocumentState(prev => ({
        ...prev,
        details: newDetails
      }));
    } else if (direction === 'down' && index < documentState.details.length - 1) {
      const newDetails = [...documentState.details];
      [newDetails[index], newDetails[index + 1]] = [newDetails[index + 1], newDetails[index]];
      setDocumentState(prev => ({
        ...prev,
        details: newDetails
      }));
    }
  };

  const calculateTotals = () => {
    const totals = documentState.details.reduce((acc, detail) => {
      acc.debit += parseFloat(detail.jrdDebit) || 0;
      acc.credit += parseFloat(detail.jrdCredit) || 0;
      return acc;
    }, { debit: 0, credit: 0 });

    return {
      debit: totals.debit.toFixed(2),
      credit: totals.credit.toFixed(2),
      balance: (totals.debit - totals.credit).toFixed(2)
    };
  };

  const navigateToJournal = (direction) => {
    if (direction === 'prev' && currentJournalIndex > 0) {
      setCurrentJournalIndex(currentJournalIndex - 1);
      handleOpenModal('view', tableData[currentJournalIndex - 1]);
    } else if (direction === 'next' && currentJournalIndex < tableData.length - 1) {
      setCurrentJournalIndex(currentJournalIndex + 1);
      handleOpenModal('view', tableData[currentJournalIndex + 1]);
    }
  };

  const printDocument = () => {
    const printWindow = window.open('', '_blank');
    const totals = calculateTotals();

    const html = `
      <!DOCTYPE html>
      <html dir="${direction}">
        <head>
          <title>${t('journal.printTitle')}</title>
          <style>
            body {
              font-family: '${direction === 'rtl' ? 'IRANSansX' : 'Arial'}', sans-serif; 
              margin: 20px; 
              direction: ${direction};
              text-align: ${direction === 'rtl' ? 'right' : 'left'};
            }
            .header { 
              text-align: center;
              margin-bottom: 30px; 
              border-bottom: 2px solid ${theme.palette.border.dark}; 
              padding-bottom: 10px; 
            }
            .document-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px; 
            }
            .info-item { 
              margin: 5px 0; 
            }
            table {
              width: 100%;
              border-collapse: collapse; 
              margin: 20px 0; 
            }
            th, td {
              border: 1px solid ${theme.palette.border.dark}; 
              padding: 8px; 
              text-align: ${direction === 'rtl' ? 'right' : 'left'}; 
            }
            th { 
                              background-color: ${theme.palette.action.hover}; 
              font-weight: bold;
            }
            .totals {
              margin-top: 20px;
              text-align: ${direction === 'rtl' ? 'left' : 'right'}; 
            }
            .total-row { 
              font-weight: bold;
              font-size: 16px; 
            }
            .footer { 
              margin-top: 40px; 
              text-align: center; 
              font-size: 12px; 
              color: ${theme.palette.text.secondary}; 
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${t('journal.title')}</h1>
            <h2>${t('journal.printTitle')}</h2>
          </div>
          
            <div class="document-info">
            <div>
              <div class="info-item"><strong>${t('journal.code')}:</strong> ${documentState.jrnCode}</div>
              <div class="info-item"><strong>${t('journal.date')}:</strong> ${formatDateYMD(documentState.jrnDate)}</div>
              <div class="info-item"><strong>${t('journal.type')}:</strong> ${documentState.jrnType}</div>
            </div>
            <div>
              <div class="info-item"><strong>${t('journal.module')}:</strong> ${documentState.jrnModule || '-'}</div>
              <div class="info-item"><strong>${t('journal.refCode')}:</strong> ${documentState.jrnRefCode || '-'}</div>
              <div class="info-item"><strong>${t('journal.posted')}:</strong> ${documentState.jrnIsPosted ? t('common.yes') : t('common.no')}</div>
          </div>
          </div>
          
          <div class="info-item">
            <strong>${t('journal.description')}:</strong> ${documentState.jrnDesc}
          </div>
          
          <table>
            <thead>
              <tr>
                <th>${t('journal.row')}</th>
                <th>${t('journal.account')}</th>
                <th>${t('journal.description')}</th>
                <th>${t('journal.debit')}</th>
                <th>${t('journal.credit')}</th>
              </tr>
            </thead>
            <tbody>
              ${documentState.details.map((detail, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${detail.jrdAccCode}</td>
                  <td>${detail.jrdDesc}</td>
                  <td>${detail.jrdDebit > 0 ? detail.jrdDebit.toLocaleString() : '-'}</td>
                  <td>${detail.jrdCredit > 0 ? detail.jrdCredit.toLocaleString() : '-'}</td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <div class="total-row">${t('journal.totalDebit')}: ${parseFloat(totals.debit).toLocaleString()}</div>
            <div class="total-row">${t('journal.totalCredit')}: ${parseFloat(totals.credit).toLocaleString()}</div>
            <div class="total-row">${t('journal.balance')}: ${parseFloat(totals.balance).toLocaleString()}</div>
          </div>
          
          <div class="footer">
            <p>${t('journal.printFooter')}</p>
            <p>${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
      printWindow.print();
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tableData.map(journal => ({
      [t('journal.code')]: journal.jrnCode,
      [t('journal.date')]: formatDateYMD(new Date(journal.jrnDate)),
      [t('journal.description')]: journal.jrnDesc,
      [t('journal.type')]: journal.jrnType,
      [t('journal.module')]: journal.jrnModule || '-',
      [t('journal.refCode')]: journal.jrnRefCode || '-',
      [t('journal.posted')]: journal.jrnIsPosted ? t('common.yes') : t('common.no'),
      [t('journal.createdBy')]: journal.jrnCreatedBy || '-'
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, t('journal.title'));

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${t('journal.title')}_${formatDateYMD(new Date())}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDelete = async (journalCodes) => {
    try {
      const response = await deleteJournal(journalCodes);
      if (response.success) {
        setSnackbar({
          open: true,
          message: getMessage(response.message),
          severity: 'success'
        });
        fetchJournals();
      } else {
        setSnackbar({
          open: true,
          message: getErrorMessage(response.error),
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error deleting journals:', error);
      setSnackbar({
        open: true,
        message: getErrorMessage(error),
        severity: 'error'
      });
    }
  };

  const handleContextMenu = (event, index) => {
    event.preventDefault();
    setSelectedRowIndex(index);
    setContextMenuAnchor(event.currentTarget);
    setContextMenuOpen(true);
  };

  const handleContextMenuClose = () => {
    setContextMenuOpen(false);
    setContextMenuAnchor(null);
  };

  const handleAccountSelect = (accountCode) => {
    if (selectedRowIndex !== null) {
      updateDetail(selectedRowIndex, 'jrdAccCode', accountCode);
    }
    setAccountTreeOpen(false);
  };

  const filteredAccounts = useMemo(() => {
    if (!accountFilter) return allAccounts;
    return allAccounts.filter(account => 
      account.accCode.toLowerCase().includes(accountFilter.toLowerCase()) ||
      account.accName.toLowerCase().includes(accountFilter.toLowerCase())
    );
  }, [allAccounts, accountFilter]);

  const handleCreateJournal = () => {
    handleOpenModal('create');
  };

  const handleViewJournal = (journal) => {
    handleOpenModal('view', journal);
  };

  const handleEditJournal = (journal) => {
    handleOpenModal('edit', journal);
  };

  const handleDeleteJournal = async (journal) => {
    const confirmed = window.confirm(t('common.confirmDelete'));
    if (confirmed) {
      try {
        const response = await deleteJournal([journal.jrnCode]);
        if (response.success) {
          setSnackbar({
            open: true,
            message: getMessage(response.message),
            severity: 'success'
          });
          fetchJournals();
        } else {
          setSnackbar({
            open: true,
            message: getErrorMessage(response.error),
            severity: 'error'
          });
        }
      } catch (error) {
        console.error('Error deleting journal:', error);
        setSnackbar({
          open: true,
          message: getErrorMessage(error),
          severity: 'error'
        });
      }
    }
  };

  const printTable = () => {
    const printWindow = window.open('', '_blank');
    const html = `
      <!DOCTYPE html>
      <html dir="${direction}">
        <head>
          <title>${t('journal.printTitle')}</title>
          <style>
            body { 
              font-family: '${direction === 'rtl' ? 'IRANSansX' : 'Arial'}', sans-serif; 
              margin: 20px; 
              direction: ${direction};
              text-align: ${direction === 'rtl' ? 'right' : 'left'};
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid ${theme.palette.border.dark}; 
              padding-bottom: 10px; 
            }
            .document-info { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 20px; 
            }
            .info-item { 
              margin: 5px 0; 
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0; 
            }
            th, td { 
              border: 1px solid ${theme.palette.border.dark}; 
              padding: 8px; 
              text-align: ${direction === 'rtl' ? 'right' : 'left'}; 
            }
            th { 
                              background-color: ${theme.palette.action.hover}; 
              font-weight: bold; 
            }
            .totals { 
              margin-top: 20px; 
              text-align: ${direction === 'rtl' ? 'left' : 'right'}; 
            }
            .total-row { 
              font-weight: bold; 
              font-size: 16px; 
            }
            .footer { 
              margin-top: 40px; 
              text-align: center; 
              font-size: 12px; 
              color: ${theme.palette.text.secondary}; 
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${t('journal.title')}</h1>
            <h2>${t('journal.printTitle')}</h2>
          </div>
          
          <div class="document-info">
            <div>
              <div class="info-item"><strong>${t('journal.code')}:</strong> ${documentState.jrnCode}</div>
              <div class="info-item"><strong>${t('journal.date')}:</strong> ${formatDateYMD(documentState.jrnDate)}</div>
              <div class="info-item"><strong>${t('journal.type')}:</strong> ${documentState.jrnType}</div>
            </div>
            <div>
              <div class="info-item"><strong>${t('journal.module')}:</strong> ${documentState.jrnModule || '-'}</div>
              <div class="info-item"><strong>${t('journal.refCode')}:</strong> ${documentState.jrnRefCode || '-'}</div>
              <div class="info-item"><strong>${t('journal.posted')}:</strong> ${documentState.jrnIsPosted ? t('common.yes') : t('common.no')}</div>
            </div>
          </div>
          
          <div class="info-item">
            <strong>${t('journal.description')}:</strong> ${documentState.jrnDesc}
          </div>
          
          <table>
            <thead>
              <tr>
                <th>${t('journal.row')}</th>
                <th>${t('journal.account')}</th>
                <th>${t('journal.description')}</th>
                <th>${t('journal.debit')}</th>
                <th>${t('journal.credit')}</th>
              </tr>
            </thead>
            <tbody>
              ${documentState.details.map((detail, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${detail.jrdAccCode}</td>
                  <td>${detail.jrdDesc}</td>
                  <td>${detail.jrdDebit > 0 ? detail.jrdDebit.toLocaleString() : '-'}</td>
                  <td>${detail.jrdCredit > 0 ? detail.jrdCredit.toLocaleString() : '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <div class="total-row">${t('journal.totalDebit')}: ${parseFloat(calculateTotals().debit).toLocaleString()}</div>
            <div class="total-row">${t('journal.totalCredit')}: ${parseFloat(calculateTotals().credit).toLocaleString()}</div>
            <div class="total-row">${t('journal.balance')}: ${parseFloat(calculateTotals().balance).toLocaleString()}</div>
          </div>
          
          <div class="footer">
            <p>${t('journal.printFooter')}</p>
            <p>${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  return (
      <Box sx={{
      padding: 3,
      backgroundColor: theme.palette.background.default
    }}>
      {/* Header */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography 
            variant="h6" 
            sx={{
              color: theme.palette.text.primary
            }}
          >
            {t('journal.title')}
          </Typography>
        </Box>
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
          flexWrap: 'wrap'
        }}>
          <Button
            onClick={handleCreateJournal}
              sx={{}}
          >
            {t('journal.create')}
          </Button>
          <Button
            onClick={exportToExcel}
                sx={{}}
          >
            {t('common.export')}
          </Button>
          <Button
            onClick={printTable}
                sx={{}}
          >
            {t('common.print')}
          </Button>
        </Box>
          </Box>

      {/* جدول مجلات */}
      <Paper sx={{ mt: 2 }}>
        <TableContainer>
          <Table>
              <TableHead>
                <TableRow>
                <TableCell sx={{}}>
                  {t('journal.code')}
                </TableCell>
                <TableCell sx={{}}>
                  {t('journal.date')}
                </TableCell>
                <TableCell sx={{}}>
                  {t('journal.description')}
                </TableCell>
                <TableCell sx={{}}>
                  {t('journal.type')}
                </TableCell>
                <TableCell sx={{}}>
                  {t('journal.module')}
                </TableCell>
                <TableCell sx={{}}>
                  {t('journal.refCode')}
                </TableCell>
                <TableCell sx={{}}>
                  {t('journal.posted')}
                </TableCell>
                <TableCell sx={{}}>
                  {t('journal.createdBy')}
                </TableCell>
                <TableCell sx={{}}>
                  {t('common.actions')}
                </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <CircularProgress />
                      </TableCell>
                </TableRow>
              ) : tableData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{}}>
                    {t('common.noData')}
                      </TableCell>
                </TableRow>
              ) : (
                tableData.map((journal) => (
                  <TableRow key={journal.jrnId} hover>
                    <TableCell sx={{}}>
                      {journal.jrnCode}
                      </TableCell>
                    <TableCell sx={{}}>
                      {formatDateYMD(new Date(journal.jrnDate))}
                    </TableCell>
                    <TableCell sx={{}}>
                      {journal.jrnDesc}
                    </TableCell>
                    <TableCell sx={{}}>
                      {journal.jrnType}
                    </TableCell>
                    <TableCell sx={{}}>
                      {journal.jrnModule || '-'}
                    </TableCell>
                    <TableCell sx={{ }}>
                      {journal.jrnRefCode || '-'}
                    </TableCell>
                    <TableCell sx={{ }}>
                      {journal.jrnIsPosted ? t('common.yes') : t('common.no')}
                    </TableCell>
                    <TableCell sx={{ }}>
                      {journal.jrnCreatedBy || '-'}
                      </TableCell>
                      <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title={t('common.view')}>
                          <IconButton 
                            onClick={() => handleViewJournal(journal)}
                          sx={{
                              color: theme.palette.info.main
                            }}
                          >
                            <span>👁️</span>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('common.edit')}>
                          <IconButton 
                            onClick={() => handleEditJournal(journal)}
                          sx={{
                              color: theme.palette.warning.main
                            }}
                          >
                            <span>✏️</span>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('common.delete')}>
                          <IconButton 
                            onClick={() => handleDeleteJournal(journal)}
                          sx={{
                              color: theme.palette.error.main
                            }}
                          >
                            <span>🗑️</span>
                          </IconButton>
                        </Tooltip>
                      </Box>
                      </TableCell>
                    </TableRow>
                ))
              )}
              </TableBody>
            </Table>
          </TableContainer>
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={contextMenuAnchor}
        open={contextMenuOpen}
        onClose={handleContextMenuClose}
        slotProps={{
          paper: {
            sx: {
              minWidth: 150,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`
            }
          }
        }}
      >
        <ListItemButton onClick={() => {
          if (selectedRowIndex !== null) {
            handleOpenModal('view', tableData[selectedRowIndex]);
          }
          handleContextMenuClose();
        }}>
          <ListItemIcon>
            <span>👁️</span>
          </ListItemIcon>
          <ListItemText primary={t('common.view')} />
        </ListItemButton>
        <ListItemButton onClick={() => {
          if (selectedRowIndex !== null) {
            handleOpenModal('edit', tableData[selectedRowIndex]);
          }
          handleContextMenuClose();
        }}>
          <ListItemIcon>
            <span>✏️</span>
          </ListItemIcon>
          <ListItemText primary={t('common.edit')} />
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => {
          if (selectedRowIndex !== null) {
            handleDelete([tableData[selectedRowIndex].jrnCode]);
          }
          handleContextMenuClose();
        }}>
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          <ListItemText primary={t('common.delete')} />
        </ListItemButton>
      </Menu>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 