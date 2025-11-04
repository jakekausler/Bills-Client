import React from 'react';
import { Card, Title, Stack, Group, Text, Divider } from '@mantine/core';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export default function HsaSummary() {
  const accounts = useSelector((state: RootState) => state.accounts.accounts);
  const hsaAccounts = accounts.filter((a) => a.type === 'HSA');

  return (
    <Card shadow="sm" p="lg">
      <Title order={3} mb="md">
        HSA Accounts
      </Title>

      {hsaAccounts.length === 0 ? (
        <Stack gap="sm">
          <Text c="dimmed" size="sm" ta="center" py="md">
            No HSA accounts configured.
          </Text>
          <Text c="dimmed" size="xs" ta="center">
            Create an HSA account in the Accounts page to enable automatic reimbursements.
          </Text>
        </Stack>
      ) : (
        <Stack gap="md">
          {hsaAccounts.map((account) => (
            <div key={account.id}>
              <Group justify="space-between">
                <div>
                  <Text fw={700}>{account.name}</Text>
                  <Text size="sm" c="dimmed">
                    Balance: ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                </div>
              </Group>
            </div>
          ))}

          <Divider />

          <Text size="xs" c="dimmed" ta="center">
            HSA reimbursements appear as transfers in your account activity
          </Text>
        </Stack>
      )}
    </Card>
  );
}
