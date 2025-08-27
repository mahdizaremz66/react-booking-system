import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../theme';
import { Dialog, DialogContent, Box, IconButton, Typography, Button, Tooltip } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { MRT_Localization_FA } from 'material-react-table/locales/fa';
import { getAllAccounts, buildAccountTree } from '../services/accountService';
import CancelRounded from '@mui/icons-material/CancelRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BookIcon from '@mui/icons-material/Book';

export default function AccountingAccountSelectDialog({ open, onClose, onSelect, selectableType = 'leaf' }) {
  const { t, i18n } = useTranslation();
  const { direction } = useAppTheme();
  const [accounts, setAccounts] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [keyboardError, setKeyboardError] = useState('');
  const tableInstanceRef = useRef(null);

  useEffect(() => {
    if (open) {
      getAllAccounts().then(res => setAccounts(res.data || []));
      setSelectedRow(null);
      setKeyboardError('');
      setTimeout(() => {
        tableInstanceRef.current?.refs.globalFilterInputRef?.current?.focus();
      }, 150);
    }
  }, [open]);

  const treeData = useMemo(() => buildAccountTree(accounts), [accounts]);

  const columns = useMemo(() => [
    { accessorKey: 'accCode', header: t('accounting.accountCode'), size: 120 },
    { accessorKey: 'accName', header: t('accounting.accountName'), size: 200 }
  ], [t]);

  const isSelectable = (row) => {
    if (!row || !row.original) return false;
    const account = row.original;
    if (selectableType === 'leaf') return account.accSublevelFormat === 0;
    if (selectableType === 'group') return account.accSublevelFormat > 0;
    return true;
  };

  const handleSelect = () => {
    if (selectedRow && isSelectable({ original: selectedRow })) {
      onSelect(selectedRow);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { direction: direction, maxWidth: 550, width: '100%' } } }}
    >
              <Box>
        <Tooltip title={t('common.close')}>
          <IconButton onClick={onClose} color="error">
                            <CancelRounded />
          </IconButton>
        </Tooltip>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BookIcon />
          <Typography variant="h6">
            {t('accounting.selectAccount')}
          </Typography>
        </Box>
      </Box>
      <DialogContent sx={{ p: { xs: 1.5, md: 2 }, pt: 2, pb: 1 }}>
        <MaterialReactTable
          columns={columns}
          data={treeData}
          enableTreeData
          enableExpanding
          getTreeRowId={row => row.accCode}
          getSubRows={(row) => row.children}
          tableInstanceRef={tableInstanceRef}
          enableKeyboardNavigation
          muiSearchTextFieldProps={{
            onKeyDown: (event) => {
              if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                tableInstanceRef.current?.refs.tableContainerRef.current?.focus();
              }
            },
          }}
          enableRowSelection={false}
          enableRowActions={false}
          enableColumnFilters
          enableGlobalFilter
          enableDensityToggle={false}
          enableFullScreenToggle={false}
          enableHiding={false}
          enableColumnActions={false}
          enableTopToolbar
          enableBottomToolbar={false}
          muiTableBodyRowProps={({ row }) => ({
            onClick: () => {
              if (isSelectable(row)) {
                setSelectedRow(row.original);
                setKeyboardError('');
              } else {
                setKeyboardError(t('accounting.accountNotSelectable'));
              }
            },
            onDoubleClick: () => {
              if (isSelectable(row)) {
                onSelect(row.original);
                onClose();
              }
            },
            onFocus: () => {
              setSelectedRow(row.original);
            },
            onKeyDown: (event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                if (isSelectable(row)) {
                  onSelect(row.original);
                  onClose();
                } else {
                  setKeyboardError(t('accounting.accountNotSelectable'));
                }
              } else if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(event.key)) {
                setKeyboardError('');
              }
            },
            sx: {
              cursor: isSelectable(row) ? 'pointer' : 'not-allowed',
                              bgcolor: isSelectable(row) ? (selectedRow?.accCode === row.original.accCode ? theme.palette.warning.light : undefined) : theme.palette.action.hover,
            }
          })}
          localization={i18n.language === 'fa' ? MRT_Localization_FA : undefined}
          initialState={{
            density: 'compact',
            expanded: true,
            showGlobalFilter: true,
            pagination: { pageSize: 1000 }
          }}
          muiTableContainerProps={{ sx: { maxHeight: 400 } }}
        />
      </DialogContent>
      <Box sx={{ p: 2, pt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography color="error" variant="caption">
          {keyboardError}
        </Typography>
        <Button
          onClick={handleSelect}
          color="warning"
          disabled={!isSelectable({ original: selectedRow })}
                        sx={{}}
        >
          {t('common.select')}
        </Button>
      </Box>
    </Dialog>
  );
} 