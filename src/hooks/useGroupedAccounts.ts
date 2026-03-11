import { useMemo } from 'react';

interface GroupedOptions {
  group: string;
  items: { value: string; label: string }[];
}

/**
 * Groups accounts by type for use in Mantine Select/ComboBox components.
 * @param accounts - Array of account objects with at least `name`, `id`, and `type` fields
 * @param valueField - Which field to use as the option value ('name' or 'id')
 */
export function useGroupedAccounts(
  accounts: { name: string; id: string; type: string }[],
  valueField: 'name' | 'id' = 'name'
): GroupedOptions[] {
  return useMemo(() => {
    const grouped: Record<string, { value: string; label: string }[]> = {};
    for (const account of accounts) {
      if (!(account.type in grouped)) {
        grouped[account.type] = [];
      }
      grouped[account.type].push({
        value: account[valueField],
        label: account.name,
      });
    }
    return Object.entries(grouped).map(([group, items]) => ({ group, items }));
  }, [accounts, valueField]);
}
