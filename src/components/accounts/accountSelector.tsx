import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { selectAccountsLoaded, selectVisibleAccounts } from "../../features/accounts/select";
import { AppDispatch } from "../../store";
import { Box, LoadingOverlay, Stack, Table, Text, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { loadAccounts } from "../../features/accounts/actions";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { CheckboxIcon } from "../helpers/checkboxIcon";

export default function AccountSelector({
  selectedAccounts,
  updateSelectedAccounts,
}: {
  selectedAccounts: string[];
  updateSelectedAccounts: ActionCreatorWithPayload<string[], "graphView/updateSelectedAccounts" | "calendar/updateSelectedAccounts" | "categories/updateSelectedAccounts" | "flow/updateSelectedAccounts" | "monteCarlo/updateSelectedAccounts">;
}) {
  const accounts = useSelector(selectVisibleAccounts);
  const accountsLoaded = useSelector(selectAccountsLoaded);
  const dispatch = useDispatch<AppDispatch>();

  const [showLoading, setShowLoading] = useState(false);

  const theme = useMantineTheme();

  useEffect(() => {
    dispatch(loadAccounts());
  }, []);

  useEffect(() => {
    const isLoading = !accountsLoaded;

    if (isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(true);
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [accountsLoaded]);

  useEffect(() => {
    dispatch(loadAccounts());
  }, [dispatch]);

  const accountsWithCategories = accounts.reduce((acc, account) => {
    if (!acc[account.type]) {
      acc[account.type] = [];
    }
    acc[account.type].push(account);
    return acc;
  }, {} as Record<string, typeof accounts>);

  return (
    <Stack h="100%" w="100%" pos="relative">
      <LoadingOverlay
        visible={showLoading}
        loaderProps={{ color: 'blue.6', size: 'xl' }}
        overlayProps={{ blur: 1, opacity: 1, zIndex: 1000 }}
      />
      <Table verticalSpacing={4} withRowBorders={false}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Account</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>
              <Text size="xs" fw={500}>Select All</Text>
            </Table.Td>
            <Table.Td>
              <CheckboxIcon
                checked={selectedAccounts.length === accounts.length}
                onChange={() =>
                  dispatch(
                    updateSelectedAccounts(
                      selectedAccounts.length === accounts.length ? [] : accounts.map((a) => a.id),
                    ),
                  )
                }
                checkedIcon={<IconEye stroke={1.5} color={theme.colors.orange[6]} size={16} />}
                uncheckedIcon={<IconEyeOff stroke={1.5} color={theme.colors.orange[6]} size={16} />}
              />
            </Table.Td>
          </Table.Tr>
          {Object.entries(accountsWithCategories).map(([type, accounts]) => (
            <>
              <Table.Tr>
                <Table.Td><Box h={8} /></Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <Text size="xs" fw={500}>{type}</Text>
                </Table.Td>
                <Table.Td>
                  <CheckboxIcon
                    checked={accounts.every((a) => selectedAccounts.includes(a.id))}
                    onChange={() =>
                      dispatch(
                        updateSelectedAccounts(
                          accounts.every((a) => selectedAccounts.includes(a.id))
                            ? selectedAccounts.filter((id) => !accounts.some((a) => a.id === id))
                            : [...selectedAccounts, ...accounts.map((a) => a.id)]
                        ),
                      )
                    }
                    checkedIcon={<IconEye stroke={1.5} color={theme.colors.blue[6]} size={16} />}
                    uncheckedIcon={<IconEyeOff stroke={1.5} color={theme.colors.blue[6]} size={16} />}
                  />
                </Table.Td>
              </Table.Tr>
              {accounts.map((account) => (
                <Table.Tr key={account.id}>
                  <Table.Td>
                    <Text size="xs">{account.name}</Text>
                  </Table.Td>
                  <Table.Td>
                    <CheckboxIcon
                      checked={selectedAccounts.includes(account.id)}
                      onChange={() =>
                        dispatch(
                          updateSelectedAccounts(
                            selectedAccounts.includes(account.id) ? selectedAccounts.filter((a) => a !== account.id) : [...selectedAccounts, account.id],
                          ),
                        )
                      }
                      checkedIcon={<IconEye size={16} />}
                      uncheckedIcon={<IconEyeOff size={16} />}
                    />
                  </Table.Td>
                </Table.Tr>
              ))}
            </>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
