declare global {
    interface Window {
        Selection: typeof Selection['constructor'];
        DataTransfer: typeof DataTransfer['constructor'];
        Node: typeof Node['constructor'];
    }
}

/**
 * Returns the host window of a DOM node
 */
export const getDefaultView = (value: any): Window => {
    return (
        (value && value.ownerDocument && value.ownerDocument.defaultView) || window
    );
}