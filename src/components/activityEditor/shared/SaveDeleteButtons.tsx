import React from 'react';
import { Button, Group } from '@mantine/core';

interface SaveDeleteButtonsProps {
  allValid: () => boolean;
  onSave: () => void;
  onDelete: () => Promise<void>;
  isNew: boolean;
  itemId?: string;
  disableDelete?: boolean;
}

export const SaveDeleteButtons: React.FC<SaveDeleteButtonsProps> = ({
  allValid,
  onSave,
  onDelete,
  isNew,
  itemId,
  disableDelete = false,
}) => {
  const isValid = allValid();
  const shouldDisableDelete = isNew || !itemId || disableDelete;

  return (
    <Group w="100%" grow>
      <Button
        disabled={!isValid}
        title={!isValid ? 'Fix validation errors before saving' : undefined}
        onClick={onSave}
      >
        Save
      </Button>

      <Button
        disabled={shouldDisableDelete}
        title={
          !itemId ? 'Item has not been saved yet' : disableDelete ? 'Cannot remove this item' : undefined
        }
        onClick={async () => {
          try {
            await onDelete();
          } catch {
            // error already dispatched
          }
        }}
      >
        Remove
      </Button>
    </Group>
  );
};
