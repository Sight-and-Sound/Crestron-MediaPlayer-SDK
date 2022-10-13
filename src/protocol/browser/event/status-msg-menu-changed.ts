/*

ADD FAVORITE DIALOG
{
    "text": "Would you like to call this favorite?",
    "timeoutSec": 30,
    "userInputRequired": "alphanumeric",
    "initialUserInput": "KINK",
    "show": true,
    "textForItems": ["OK", "Cancel"],
    "localExit": true,
    "listShown": false,
    "listDescriptionText": "Add your favorite to this account",
    "listItems": ["Roger"],
    "listItemIndicesInitiallySelected": ["1"]
}

*/

export class StatusMsgMenuChanged {
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
