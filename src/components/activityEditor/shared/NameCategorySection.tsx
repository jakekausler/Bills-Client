import React from 'react';
import { Select, ComboboxParsedItem } from '@mantine/core';
import CreatableSelect from '../../helpers/creatableSelect';
import { NameEntry, NameMetadata } from '../../../types/types';

interface NameCategorySectionProps {
  name: string;
  category: string;
  names: NameEntry[];
  categories: Array<{ group: string; items: Array<{ value: string; label: string }> }>;
  onNameWithMetadataChange: (name: string, metadata?: NameMetadata) => void;
  onCategoryChange: (category: string) => void;
  validate: (name: string, value: any) => string | null;
  error?: string | null;
  categoryTouched: boolean;
  setCategoryTouched: (touched: boolean) => void;
}

export const NameCategorySection: React.FC<NameCategorySectionProps> = ({
  name,
  category,
  names,
  categories,
  onNameWithMetadataChange,
  onCategoryChange,
  validate,
  error,
  categoryTouched,
  setCategoryTouched,
}) => {
  // Convert NameEntry array to dropdown data with composite values
  const dropdownData = names.map((entry, index) => ({
    label: entry.name,
    value: `${entry.name}||${entry.category}||${index}`, // unique composite value
    category: entry.category,
    entry, // Store the full entry for later lookup
  }));

  return (
    <>
      <CreatableSelect
        label="Name"
        error={validate('name', name)}
        value={name}
        onChange={(v: string | null) => {
          const newValue = v || '';
          if (!categoryTouched && v) {
            // Check if value is a composite key (from dropdown selection)
            const parts = v.split('||');
            if (parts.length === 3) {
              // It's a composite value from dropdown
              const index = parseInt(parts[2], 10);
              const entry = names[index];
              if (entry) {
                // Extract metadata (without name field)
                const { name: _, ...metadata } = entry;
                onNameWithMetadataChange(newValue, metadata);
              }
            } else {
              // It's a newly created or plain name
              onNameWithMetadataChange(newValue);
            }
          } else {
            onNameWithMetadataChange(newValue);
          }
        }}
        data={dropdownData.map(({ label, value, category }) => ({
          label,
          value,
          category,
        }))}
        clearable
      />
      <Select
        label="Category"
        value={category}
        data={categories}
        onChange={(v) => {
          onCategoryChange(v || '');
          setCategoryTouched(true);
        }}
        searchable
        filter={({ options, search }) => {
          const query = search.toLowerCase().trim();
          if (!query) return options;
          return (options as ComboboxParsedItem[]).flatMap((option) => {
            if ('items' in option) {
              const groupName = (option as any).group?.toLowerCase() || '';
              const filtered = (option as any).items.filter(
                (item: any) =>
                  (item.label?.toLowerCase() ?? '').includes(query) ||
                  groupName.includes(query)
              );
              return filtered.length > 0 ? [{ ...(option as any), items: filtered }] : [];
            }
            return (option as any).label?.toLowerCase().includes(query) ? [option] : [];
          }) as ComboboxParsedItem[];
        }}
        error={validate('category', category)}
      />
    </>
  );
};
