export enum UserInput
{
    Alphanumeric = 'alphanumeric',
    Confirm = 'Confirm',
}

export class CrpcDialog
{
    public close: (
        itemNumber: number,
        userInput?: string | boolean | number,
    ) => void;

    constructor(
        callback: (
            itemNumber: number,
            userInput?: string | boolean | number,
        ) => void,
    )
    {
        this.close = callback;
    }

    text!: string;
    userInputRequired!: string;
    show!: boolean;
    localExit!: boolean;

    timeoutSec?: number;
    initialUserInput?: string;
    textForItems?: string[];
    listShown?: boolean;
    listDescriptionText?: string;
}
