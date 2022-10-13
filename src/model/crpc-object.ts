export class CrpcObject
{
    public '@category'!: string;
    public uuid!: string;
    public instanceName!: string;
    public name!: string;
    public interfaces: string[] = [];
    public isIMediaPlayer!: boolean;

    // for some reason DM-NAX returns lowercase instancename, set that straight.
    public set instancename(val: string)
    {
        this.instanceName = val;
    }

    public isMediaPlayer(): boolean
    {
        return (
            this.isIMediaPlayer || this.interfaces.indexOf('IMediaPlayer') !== -1
        );
    }

    public isMenu(): boolean
    {
        return this.interfaces.indexOf('IMenu') !== -1;
    }
}
