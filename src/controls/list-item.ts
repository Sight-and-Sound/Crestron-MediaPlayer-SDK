export interface CrpcListItem
{
    ID: string;
    L1: string;
    L2?: string;
    URL?: string;
    URLNAT?: string;
}

export class ListItem
{
    public id!: string;
    public title: string = '';
    public subtitle?: string = '';
    public imageUrl?: string = '';
    public imageUrlNat?: string = '';

    constructor(
        id: string,
        itemNumber: number,
        title: string,
        public select: () => void
    )
    {
        this.id = id;
        this.title = title;
    }

    public static fromCrpc(
        data: CrpcListItem,
        itemNumber: number,
        select: () => void
    ): ListItem
    {
        return Object.assign(new ListItem(data.ID, itemNumber, data.L1, select), {
            subtitle: data.L2,
            imageUrl: data.URL,
            imageUrlNat: data.URLNAT,
        });
    }
}
