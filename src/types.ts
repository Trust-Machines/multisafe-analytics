export type Status = 'mempool' | 'microblock' | 'anchor' | 'failed';
export type Network = 'mainnet' | 'testnet';

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

export interface AssetBalance {
    asset: string,
    balance: string,
    asset_info?: {
        address: string,
        identifier: string
    } | {
        "address": string,
        "identifier": string,
        "name": string,
        "symbol": string,
        "decimals": number
    }
}

export interface Stats {
    safe_count: number,
    balances: AssetBalance[]
}
