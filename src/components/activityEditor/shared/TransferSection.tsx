import React from 'react';
import { Checkbox, Select, Stack } from '@mantine/core';

interface TransferSectionProps {
  isTransfer: boolean;
  from: string | null;
  to: string | null;
  accountList: { group: string; items: { value: string; label: string }[] }[];
  onIsTransferChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFromChange: (value: string | null) => void;
  onToChange: (value: string | null) => void;
  validate: (name: string, value: any) => string | null;
  error?: string | null;
}

export const TransferSection: React.FC<TransferSectionProps> = ({
  isTransfer,
  from,
  to,
  accountList,
  onIsTransferChange,
  onFromChange,
  onToChange,
  validate,
  error,
}) => {
  return (
    <>
      <Checkbox
        label="Is this a transfer?"
        checked={isTransfer}
        onChange={onIsTransferChange}
        error={error}
      />
      {isTransfer && (
        <Stack gap="sm" role="region" aria-label="Transfer details">
          <Select
            label="From Account"
            value={from}
            data={accountList}
            searchable
            placeholder="Select an account"
            onChange={(v) => {
              onFromChange(v);
            }}
            error={validate('from', from)}
          />
          <Select
            label="To Account"
            value={to}
            data={accountList}
            searchable
            placeholder="Select an account"
            onChange={(v) => {
              onToChange(v);
            }}
            error={validate('to', to)}
          />
        </Stack>
      )}
    </>
  );
};
