import {Network} from './types';

export const getContractInfo = (contract: string, network: Network): Promise<{ tx_id: string }> => {
    return fetch(`https://stacks-node-api.${network}.stacks.co/extended/v1/contract/${contract}`).then(r => r.json());
}
