export type Status = 'mempool' | 'microblock' | 'anchor' | 'failed';


export interface Safe {
    address: string,
    sender: string,
    tx_hash: string,
    threshold: number,
    version: string,
    nonce: number,
    owners: string[],
    time: number,
    status: Status,
    balance: string
}


export type Network = 'mainnet' | 'testnet';
