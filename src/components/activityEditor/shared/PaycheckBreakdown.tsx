import React from 'react';
import { Stack, Group, Text, Divider, Paper } from '@mantine/core';
import { PaycheckDetails } from '../../../types/types';

interface PaycheckBreakdownProps {
  details: PaycheckDetails;
}

const formatCurrency = (value: number): string => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

export const PaycheckBreakdown: React.FC<PaycheckBreakdownProps> = ({ details }) => {
  const preTaxSubtotal = details.preTaxDeductions.reduce((sum, item) => sum + item.amount, 0);
  const postTaxSubtotal = details.postTaxDeductions.reduce((sum, item) => sum + item.amount, 0);
  const totalTaxes = details.ssTax + details.medicareTax;
  const hasEmployerContributions = details.employerMatch > 0 || details.hsaEmployer > 0;

  return (
    <Paper p="md" radius="md" withBorder bg="gray.0">
      <Stack gap="md">
        {/* Gross Pay */}
        <Group justify="space-between">
          <Text fw={600}>Gross Pay</Text>
          <Text fw={600}>{formatCurrency(details.grossPay)}</Text>
        </Group>

        <Divider />

        {/* Pre-Tax Deductions */}
        {details.preTaxDeductions.length > 0 && (
          <>
            <div>
              <Text fw={600} size="sm" mb="xs">
                Pre-Tax Deductions
              </Text>
              <Stack gap="xs" ml="md">
                {details.preTaxDeductions.map((deduction, idx) => (
                  <Group justify="space-between" key={idx}>
                    <Text size="sm">{deduction.label}</Text>
                    <Text size="sm">-{formatCurrency(deduction.amount)}</Text>
                  </Group>
                ))}
                {details.traditional401k > 0 && (
                  <Group justify="space-between">
                    <Text size="sm">Traditional 401(k)</Text>
                    <Text size="sm">-{formatCurrency(details.traditional401k)}</Text>
                  </Group>
                )}
                {details.hsa > 0 && (
                  <Group justify="space-between">
                    <Text size="sm">HSA</Text>
                    <Text size="sm">-{formatCurrency(details.hsa)}</Text>
                  </Group>
                )}
                <Divider size="xs" />
                <Group justify="space-between">
                  <Text size="sm" fw={500}>
                    Subtotal
                  </Text>
                  <Text size="sm" fw={500}>
                    -
                    {formatCurrency(
                      preTaxSubtotal + details.traditional401k + details.hsa,
                    )}
                  </Text>
                </Group>
              </Stack>
            </div>
            <Divider />
          </>
        )}

        {/* Taxes */}
        <div>
          <Text fw={600} size="sm" mb="xs">
            Taxes
          </Text>
          <Stack gap="xs" ml="md">
            <Group justify="space-between">
              <Text size="sm">Social Security Tax</Text>
              <Text size="sm">-{formatCurrency(details.ssTax)}</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm">Medicare Tax</Text>
              <Text size="sm">-{formatCurrency(details.medicareTax)}</Text>
            </Group>
            <Divider size="xs" />
            <Group justify="space-between">
              <Text size="sm" fw={500}>
                Total Taxes
              </Text>
              <Text size="sm" fw={500}>
                -{formatCurrency(totalTaxes)}
              </Text>
            </Group>
          </Stack>
        </div>

        <Divider />

        {/* Post-Tax Deductions */}
        {(details.postTaxDeductions.length > 0 || details.roth401k > 0) && (
          <>
            <div>
              <Text fw={600} size="sm" mb="xs">
                Post-Tax Deductions
              </Text>
              <Stack gap="xs" ml="md">
                {details.roth401k > 0 && (
                  <Group justify="space-between">
                    <Text size="sm">Roth 401(k)</Text>
                    <Text size="sm">-{formatCurrency(details.roth401k)}</Text>
                  </Group>
                )}
                {details.postTaxDeductions.map((deduction, idx) => (
                  <Group justify="space-between" key={idx}>
                    <Text size="sm">{deduction.label}</Text>
                    <Text size="sm">-{formatCurrency(deduction.amount)}</Text>
                  </Group>
                ))}
                <Divider size="xs" />
                <Group justify="space-between">
                  <Text size="sm" fw={500}>
                    Subtotal
                  </Text>
                  <Text size="sm" fw={500}>
                    -{formatCurrency(postTaxSubtotal + details.roth401k)}
                  </Text>
                </Group>
              </Stack>
            </div>
            <Divider />
          </>
        )}

        {/* Net Pay */}
        <Paper p="sm" bg="blue.0" radius="md">
          <Group justify="space-between">
            <Text fw={700} size="lg">
              Net Pay
            </Text>
            <Text fw={700} size="lg" c="blue">
              {formatCurrency(details.netPay)}
            </Text>
          </Group>
        </Paper>

        {/* Employer Contributions */}
        {hasEmployerContributions && (
          <>
            <Divider />
            <div>
              <Text fw={600} size="sm" mb="xs">
                Employer Contributions (not deducted from pay)
              </Text>
              <Stack gap="xs" ml="md">
                {details.employerMatch > 0 && (
                  <Group justify="space-between">
                    <Text size="sm">Employer Match</Text>
                    <Text size="sm" c="green">
                      +{formatCurrency(details.employerMatch)}
                    </Text>
                  </Group>
                )}
                {details.hsaEmployer > 0 && (
                  <Group justify="space-between">
                    <Text size="sm">Employer HSA</Text>
                    <Text size="sm" c="green">
                      +{formatCurrency(details.hsaEmployer)}
                    </Text>
                  </Group>
                )}
              </Stack>
            </div>
          </>
        )}
      </Stack>
    </Paper>
  );
};
