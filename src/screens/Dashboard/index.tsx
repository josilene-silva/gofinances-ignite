import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from "react-native";

import { useTheme } from 'styled-components';

import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";

import {
    Container,
    Header,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    UserWrapper,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionsList,
    LoadContainer
} from "./styles";

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    amount: string;
}

interface HighlightData {
    entries: HighlightProps;
    expensive: HighlightProps;
    total: HighlightProps;
}

export function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

    const theme = useTheme();

    async function loadTransaction() {
        const dataKey = '@gofinances:transactions';

        const response = await AsyncStorage.getItem(dataKey);

        const transaction = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensiveTotal = 0;

        const transactionsFormatted: DataListProps[] = transaction
            .map((item: DataListProps) => {
                if(item.type === 'positive') {
                    entriesTotal += Number(item.amount);
                } else {
                    expensiveTotal += Number(item.amount);
                }

                const amount = Number(item.amount)
                    .toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    });

                const dateFormatted = Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                }).format(new Date(item.date));

                return {
                    id: item.id,
                    type: item.type,
                    name: item.name,
                    amount,
                    category: item.category,
                    date: dateFormatted,
                }
            });

        const total = entriesTotal - expensiveTotal;

        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            },
            expensive: {
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            },

        });
        setTransactions(transactionsFormatted);
        setIsLoading(false);
    }

    useEffect(() => {
        loadTransaction();
    }, []);

    useFocusEffect(useCallback(() => {
        loadTransaction();
    }, []));

    return(
        <Container>
            {
                isLoading ?
                <LoadContainer>
                    <ActivityIndicator
                        color={theme.colors.primary}
                        size='large'
                    />
                </LoadContainer> :
            <>
                <Header>
                    <UserWrapper>
                        <UserInfo>
                            <Photo
                                source={{ uri: 'https://avatars.githubusercontent.com/u/43017908?v=4' }}
                            />
                            <User>
                                <UserGreeting>Olá, </UserGreeting>
                                <UserName>Josilene</UserName>
                            </User>
                        </UserInfo>

                        <Icon name="power" />
                    </UserWrapper>
                </Header>

                <HighlightCards>
                    <HighlightCard
                        type="up"
                        title="Entradas"
                        amount={highlightData.entries.amount}
                        lastTransaction="Última entrada dia 13 de abril"/>
                    <HighlightCard
                        type="down"
                        title="Saídas"
                        amount={highlightData.expensive.amount}
                        lastTransaction="Última saída dia 03 de abril"/>
                    <HighlightCard
                        type="total"
                        title="Total"
                        amount={highlightData.total.amount}
                        lastTransaction="01 à 16 de abril"/>
                </HighlightCards>

                <Transactions>
                    <Title>Listagem</Title>

                    <TransactionsList
                        data={transactions}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <TransactionCard data={item} /> }
                    />
                </Transactions>
            </>
            }
        </Container>
    )
}