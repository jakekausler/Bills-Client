import React from 'react';
import { Select, ComboboxParsedItem } from '@mantine/core';
import CreatableSelect from '../../helpers/creatableSelect';

interface NameCategorySectionProps {
  name: string;
  category: string;
  names: Record<string, string>;
  categories: Array<{ group: string; items: Array<{ value: string; label: string }> }>;
  onNameWithCategoryChange: (name: string, category?: string) => void;
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
  onNameWithCategoryChange,
  validate,
  error,
  categoryTouched,
  setCategoryTouched,
}) => {
  return (
    <>
      <CreatableSelect
        label="Name"
        error={validate('name', name)}
        value={name}
        onChange={(v: string | null) => {
          const newValue = v || '';
          if (!categoryTouched && v && v in names) {
            onNameWithCategoryChange(newValue, names[v]);
          } else {
            onNameWithCategoryChange(newValue);
          }
        }}
        data={Object.entries(names).map(([key, value]) => ({
          label: key,
          value: key,
          category: value,
        }))}
        clearable
      />
      <Select
        label="Category"
        value={category}
        data={categories}
        onChange={(v) => {
          onNameWithCategoryChange(name, v ? v : '');
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
