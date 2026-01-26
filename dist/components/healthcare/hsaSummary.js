import React from 'react';
import { Card, Title, Stack, Group, Text, Divider } from '@mantine/core';
import { useSelector } from 'react-redux';
export default function HsaSummary() {
    const accounts = useSelector((state) => state.accounts.accounts);
    const hsaAccounts = accounts.filter((a) => a.type === 'HSA');
    return (React.createElement(Card, { shadow: "sm", p: "lg" },
        React.createElement(Title, { order: 3, mb: "md" }, "HSA Accounts"),
        hsaAccounts.length === 0 ? (React.createElement(Stack, { gap: "sm" },
            React.createElement(Text, { c: "dimmed", size: "sm", ta: "center", py: "md" }, "No HSA accounts configured."),
            React.createElement(Text, { c: "dimmed", size: "xs", ta: "center" }, "Create an HSA account in the Accounts page to enable automatic reimbursements."))) : (React.createElement(Stack, { gap: "md" },
            hsaAccounts.map((account) => (React.createElement("div", { key: account.id },
                React.createElement(Group, { justify: "space-between" },
                    React.createElement("div", null,
                        React.createElement(Text, { fw: 700 }, account.name),
                        React.createElement(Text, { size: "sm", c: "dimmed" },
                            "Balance: $",
                            account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))))))),
            React.createElement(Divider, null),
            React.createElement(Text, { size: "xs", c: "dimmed", ta: "center" }, "HSA reimbursements appear as transfers in your account activity")))));
}
