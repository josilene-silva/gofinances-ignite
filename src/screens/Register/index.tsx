import React, { useState } from "react";
import { Modal } from "react-native";
import { useForm } from "react-hook-form";

import { Button } from "../../components/Form/Button";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";
import { InputForm } from "../../components/Form/InputForm";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import { CategorySelect } from "../CategorySelect";

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionTypes,
} from "./styles";

interface FormData {
    name: string;
    amount: String;
}

export function Register() {
    const [transactionsTypesSelect, setTransactionsTypesSelect] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    });

    const {
        control,
        handleSubmit
    } = useForm();

    function handleTransactionsTypesSelect(type: 'up' | 'down') {
        setTransactionsTypesSelect(type);
    }

    function handleOpenSelectCategoryModal() {
        setCategoryModalOpen(true);
    }

    function handleCloseSelectCategoryModal() {
        setCategoryModalOpen(false);
    }

    function handleRegister(form: FormData) {
        const data = {
            name: form.name,
            amount: form.amount,
            transactionsTypesSelect,
            category: category.key
        }

        console.log(data)
    }

    return(
        <Container>
            <Header>
                <Title>
                    Cadastro
                </Title>
            </Header>

            <Form>
                <Fields>
                    <InputForm
                        placeholder="Nome"
                        control={control}
                        name="name"
                    />
                    <InputForm
                        placeholder="Preço"
                        control={control}
                        name="amount"
                    />
                    <TransactionTypes>
                        <TransactionTypeButton
                            title="Income"
                            type="up"
                            onPress={() => handleTransactionsTypesSelect('up')}
                            isActive={transactionsTypesSelect === 'up'}
                        />
                        <TransactionTypeButton
                            title="Outcome"
                            type="down"
                            onPress={() => handleTransactionsTypesSelect('down')}
                            isActive={transactionsTypesSelect === 'down'}
                        />

                    </TransactionTypes>
                    <CategorySelectButton
                        onPress={handleOpenSelectCategoryModal}
                        title={category.name}
                    />
                </Fields>

                <Button
                    title="Enviar"
                    onPress={handleSubmit(handleRegister)}
                />
            </Form>

            <Modal visible={categoryModalOpen}>
                <CategorySelect
                    category={category}
                    setCategory={setCategory}
                    closeSelectCategory={handleCloseSelectCategoryModal}
                />
            </Modal>
        </Container>
    );
}