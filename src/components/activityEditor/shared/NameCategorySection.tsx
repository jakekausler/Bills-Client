import React from 'react';
import { Select } from '@mantine/core';
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
        data={Object.entries(names).map(([key, _value]) => ({
          label: key,
          value: key,
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
        error={validate('category', category)}
      />
    </>
  );
};
