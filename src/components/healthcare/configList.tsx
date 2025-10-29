import React, { useState } from 'react';
import {
  Card,
  Title,
  Table,
  Button,
  Group,
  ActionIcon,
  Text,
} from '@mantine/core';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { selectHealthcareConfigs, selectHealthcareLoading } from '../../features/healthcare/select';
import { deleteHealthcareConfig } from '../../features/healthcare/actions';
import { HealthcareConfig } from '../../types/types';
import ConfigForm from './configForm';

export default function ConfigList() {
  const dispatch = useDispatch<AppDispatch>();
  const configs = useSelector(selectHealthcareConfigs);
  const loading = useSelector(selectHealthcareLoading);
  const [formOpened, setFormOpened] = useState(false);
  const [editingConfig, setEditingConfig] = useState<HealthcareConfig | null>(null);

  const handleAdd = () => {
    setEditingConfig(null);
    setFormOpened(true);
  };

  const handleEdit = (config: HealthcareConfig) => {
    setEditingConfig(config);
    setFormOpened(true);
  };

  const handleDelete = (config: HealthcareConfig) => {
    if (window.confirm(`Are you sure you want to delete "${config.name}"? This action cannot be undone.`)) {
      dispatch(deleteHealthcareConfig(config.id));
    }
  };

  const handleFormClose = () => {
    setFormOpened(false);
    setEditingConfig(null);
  };

  return (
    <>
      <Card shadow="sm" p="lg">
        <Group justify="space-between" mb="md">
          <Title order={3}>Healthcare Configurations</Title>
          <Button leftSection={<IconPlus size={16} />} onClick={handleAdd}>
            Add Config
          </Button>
        </Group>

        {configs.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No healthcare configurations yet. Click "Add Config" to create one.
          </Text>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Person</th>
                <th>Plan Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Deductible (Ind/Fam)</th>
                <th>OOP Max (Ind/Fam)</th>
                <th>HSA</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {configs.map((config) => (
                <tr key={config.id}>
                  <td>{config.personName}</td>
                  <td>{config.name}</td>
                  <td>{config.startDate}</td>
                  <td>{config.endDate || 'Ongoing'}</td>
                  <td>
                    ${config.individualDeductible} / ${config.familyDeductible}
                  </td>
                  <td>
                    ${config.individualOutOfPocketMax} / ${config.familyOutOfPocketMax}
                  </td>
                  <td>{config.hsaReimbursementEnabled ? 'Enabled' : 'Disabled'}</td>
                  <td>
                    <Group gap="xs">
                      <ActionIcon color="blue" onClick={() => handleEdit(config)}>
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon color="red" onClick={() => handleDelete(config)}>
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <ConfigForm opened={formOpened} onClose={handleFormClose} config={editingConfig} />
    </>
  );
}
