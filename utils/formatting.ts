const getCurrencyForLocale = (): string => {
    const locale = navigator.language;

    if (locale.startsWith('en-GB')) return 'GBP';
    if (locale.startsWith('en-IN')) return 'INR';
    if (locale.startsWith('ja')) return 'JPY';
    if (locale.startsWith('de') || locale.startsWith('fr') || locale.startsWith('es')) return 'EUR';
    
    // Default to USD for other locales like en-US
    return 'USD';
};

export const formatCurrency = (amount: number): string => {
    const currency = getCurrencyForLocale();
    try {
        return new Intl.NumberFormat(navigator.language, {
            style: 'currency',
            currency: currency,
        }).format(amount);
    } catch (e) {
        // Fallback for environments that might not support it fully or for testing
        console.error("Currency formatting failed:", e);
        const symbol = {
            'USD': '$',
            'GBP': '£',
            'INR': '₹',
            'JPY': '¥',
            'EUR': '€',
        }[currency] || '$';
        return `${symbol}${amount.toFixed(2)}`;
    }
};

export const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    try {
        return new Intl.DateTimeFormat(navigator.language, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    } catch (e) {
        console.error("Date formatting failed:", e);
        return date.toDateString(); // Fallback
    }
};