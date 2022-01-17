import React from "react";
import { TouchableOpacityProps } from "react-native";
import {
    Container,
    Icon,
    Title,
} from "./styled";

const icons = {
    up: "arrow-up-circle",
    down: "arrow-down-circle",
}

interface Props extends TouchableOpacityProps {
    title: string;
    type: "up" | "down";
    isActive: boolean;
}

export function TransactionTypeButton({ type, title, isActive, ...rest}: Props) {
    return(
        <Container {...rest} type={type} isActive={isActive}>
            <Icon
                name={icons[type]}
                type={type}
            />
            <Title>
                {title}
            </Title>
        </Container>
    )
}