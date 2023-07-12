export const compareAddressOrder = (addressA: string, addressB: string): boolean => {
    return addressA.toLowerCase() < addressB.toLowerCase()
}