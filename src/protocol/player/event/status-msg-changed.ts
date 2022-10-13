export class StatusMsgChanged {
    text?: string;
    timeoutSec?: number;
    userInputRequired?: 'alphanumeric' | 'confirm';
    initialUserInput?: string | number;
    show?: boolean;
    textForItems?: string[];
    localExit?: boolean;
    listShown?: boolean;
    listDescriptionText?: string;
    listItems?: string[];
    listItemIndicesInitiallySelected?: number[];
}
