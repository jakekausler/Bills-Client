import React, { useState } from 'react';
import {
  Card,
  Title,
  Table,
  Button,
  Group,
  ActionIcon,
  Text,
  Loader,
  Alert,
  Modal,
  Stack,
} from '@mantine/core';
import { IconPlus, IconEdit, IconTrash, IconAlertCircle } from '@tabler/icons-react';
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
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [configToDelete, setConfigToDelete] = useState<HealthcareConfig | null>(null);

  const handleAdd = () => {
    setEditingConfig(null);
    setFormOpened(true);
  };

  const handleEdit = (config: HealthcareConfig) => {
    setEditingConfig(config);
    setFormOpened(true);
  };

  const handleDelete = (config: HealthcareConfig) => {
    setConfigToDelete(config);
    setDeleteModalOpened(true);
  };

  const confirmDelete = async () => {
    if (!configToDelete) return;

    try {
      setError(null);
      await dispatch(deleteHealthcareConfig(configToDelete.id));
      setDeleteModalOpened(false);
      setConfigToDelete(null);
    } catch (err) {
      console.error('Failed to delete config:', err);
      setError(
        err instanceof Error
          ? err.message
          : `Failed to delete healthcare configuration "${configToDelete.name}". Please try again.`
      );
      setDeleteModalOpened(false);
      setConfigToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpened(false);
    setConfigToDelete(null);
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

        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
            mb="md"
            withCloseButton
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <Group justify="center" py="xl">
            <Loader size="sm" />
            <Text c="dimmed">Loading healthcare configurations...</Text>
          </Group>
        ) : configs.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No healthcare configurations yet. Click "Add Config" to create one.
          </Text>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <Table>
              <thead>
                <tr>
                  <th>Covered Persons</th>
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
                {configs.map((config) => {
                  // Format covered persons list with overflow handling
                  const displayPersons = config.coveredPersons?.slice(0, 3).join(', ') ?? '';
                  const overflow = config.coveredPersons && config.coveredPersons.length > 3
                    ? ` +${config.coveredPersons.length - 3}`
                    : '';

                  return (
                  <tr key={config.id}>
                    <td title={config.coveredPersons?.join(', ') ?? ''}>{displayPersons}{overflow}</td>
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
                  );
                })}
              </tbody>
            </Table>
          </div>
        )}
      </Card>

      <ConfigForm opened={formOpened} onClose={handleFormClose} config={editingConfig} />

      <Modal
        opened={deleteModalOpened}
        onClose={cancelDelete}
        title="Delete Healthcare Configuration"
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to delete <strong>"{configToDelete?.name}"</strong>?
          </Text>
          <Text size="sm" c="dimmed">
            This action cannot be undone. All associated data will be permanently removed.
          </Text>
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button color="red" onClick={confirmDelete}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
