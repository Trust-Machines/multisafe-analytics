import BigNumber from 'bignumber.js';

export const formatUnits = (value: BigNumber | string, decimals: number): BigNumber => {
    const bn = typeof value === 'string' ? new BigNumber(value) : value;
    return bn.dividedBy(10 ** decimals);
}
